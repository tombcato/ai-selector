"""
AI Provider Proxy Server
========================

FastAPI 代理服务，解决浏览器 CORS 限制。

端点:
    /test   - 测试 AI Provider Model 连通性
    /chat   - 发送聊天请求
    /models - 获取模型列表

启动:
    python server.py
    # 或
    uvicorn server:app --reload --port 8000
"""

from typing import Dict, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import time

from models import (
    ChatRequest, FetchModelsRequest,
    TestConnectionResponse, ChatResponse, FetchModelsResponse,
)
from strategies import get_strategy, STRATEGY_REGISTRY

# ============================================================================
# 配置常量
# ============================================================================
    
TIMEOUT_CHAT = 100.0      # 聊天请求超时 (秒)
TIMEOUT_MODELS = 60.0    # 模型列表请求超时 (秒)

# ============================================================================
# FastAPI 应用
# ============================================================================

app = FastAPI(title="AI Provider Proxy", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:3000", "http://127.0.0.1:3000", "https://tombcato.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# 核心逻辑
# ============================================================================

async def send_chat_request(api_format: str, base_url: str, api_key: str, model: str, messages: List[Dict[str, str]], max_tokens: Optional[int]):
    """发送聊天请求"""
    strategy = get_strategy(api_format)
    async with httpx.AsyncClient(timeout=TIMEOUT_CHAT) as client:
        return await strategy.execute(client, base_url, api_key, model, messages, max_tokens)


def format_error(e: Exception) -> str:
    """格式化错误信息"""
    if isinstance(e, httpx.HTTPStatusError):
        return f"HTTP {e.response.status_code}: {e.response.text[:500]}"
    elif isinstance(e, httpx.TimeoutException):
        return f"请求超时 ({int(TIMEOUT_CHAT)}秒)"
    return str(e)




# ============================================================================
# API 端点
# ============================================================================

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "running",
        "supported_formats": list(STRATEGY_REGISTRY.keys()),
        "endpoints": ["/test", "/chat", "/models"],
    }


@app.post("/test", response_model=TestConnectionResponse, tags=["Proxy"])
async def test_connection(req: ChatRequest):
    """测试连通性"""
    start = time.time()
    try:
        await send_chat_request(req.api_format, req.base_url, req.api_key, req.model, [{"role": "user", "content": "Hi"}], None)
        return TestConnectionResponse(success=True, latency_ms=int((time.time() - start) * 1000), message="连接成功")
    except Exception as e:
        return TestConnectionResponse(success=False, latency_ms=0, message=format_error(e))


@app.post("/chat", response_model=ChatResponse, tags=["Proxy"])
async def chat(req: ChatRequest):
    """发送聊天请求"""
    if not req.messages:
        return ChatResponse(success=False, message="messages 不能为空")
    
    start = time.time()
    try:
        result = await send_chat_request(req.api_format, req.base_url, req.api_key, req.model, req.messages, req.max_tokens)
        return ChatResponse(
            success=True, content=result.content, model=result.model, usage=result.usage,
            latency_ms=int((time.time() - start) * 1000), raw_response=result.raw_response
        )
    except Exception as e:
        return ChatResponse(success=False, latency_ms=int((time.time() - start) * 1000), message=format_error(e))


@app.post("/models", response_model=FetchModelsResponse, tags=["Proxy"])
async def fetch_models(req: FetchModelsRequest):
    """获取模型列表"""
    try:
        strategy = get_strategy(req.api_format)
        if not strategy.supports_models_api:
            return FetchModelsResponse(success=False, models=[], message=f"{req.api_format} 不支持动态获取模型列表")
        
        async with httpx.AsyncClient(timeout=TIMEOUT_MODELS) as client:
            models = await strategy.fetch_models(client, req.base_url, req.api_key or "")
            
            # 按创建时间倒序排列（新的在前）
            models_sorted = sorted(
                models,
                key=lambda m: (m.get('created', 0) if isinstance(m, dict) else 0, m.get('id', '')),
                reverse=True
            )
            
            return FetchModelsResponse(success=True, models=models_sorted)
    except Exception as e:
        return FetchModelsResponse(success=False, models=[], message=format_error(e))


# ============================================================================
# 启动
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    print("🚀 AI Provider Proxy @ http://localhost:8000")
    print(f"📋 Formats: {', '.join(STRATEGY_REGISTRY.keys())}")
    uvicorn.run(app, host="0.0.0.0", port=8000)
