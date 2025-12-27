"""
AI Provider Selector - Python Backend Demo
FastAPI 代理服务，解决 CORS 问题并提供统一的 API 接口

启动方式:
    uvicorn server:app --reload --port 8000
    
或者直接运行:
    python server.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import time

app = FastAPI(title="AI Provider Proxy", version="1.0.0")

# CORS 配置 - 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ 数据模型 ============

class TestConnectionRequest(BaseModel):
    """测试连通性请求"""
    provider_id: str
    api_key: str
    model: Optional[str] = None
    base_url: Optional[str] = None
    api_format: str = "openai"  # openai | anthropic | gemini


class FetchModelsRequest(BaseModel):
    """获取模型列表请求"""
    provider_id: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None


# ============ Provider 配置 ============

PROVIDER_CONFIG = {
    "openai": {
        "base_url": "https://api.openai.com/v1",
        "auth_type": "bearer",
        "default_model": "gpt-4o-mini",
    },
    "anthropic": {
        "base_url": "https://api.anthropic.com/v1",
        "auth_type": "x-api-key",
        "default_model": "claude-3-haiku-20240307",
    },
    "gemini": {
        "base_url": "https://generativelanguage.googleapis.com/v1beta",
        "auth_type": "query-param",
        "default_model": "gemini-1.5-flash",
    },
    "deepseek": {
        "base_url": "https://api.deepseek.com",
        "auth_type": "bearer",
        "default_model": "deepseek-chat",
    },
    "groq": {
        "base_url": "https://api.groq.com/openai/v1",
        "auth_type": "bearer",
        "default_model": "llama-3.1-8b-instant",
    },
    "openrouter": {
        "base_url": "https://openrouter.ai/api/v1",
        "auth_type": "bearer",
        "default_model": "google/gemini-2.0-flash-exp:free",
    },
}


# ============ API 端点 ============

@app.get("/")
async def root():
    return {"message": "AI Provider Proxy Server", "endpoints": ["/test", "/models"]}


@app.post("/test")
async def test_connection(req: TestConnectionRequest):
    """
    测试 AI Provider 连通性
    发送一个简单的 chat completion 请求
    """
    provider = PROVIDER_CONFIG.get(req.provider_id, {})
    base_url = req.base_url or provider.get("base_url", "")
    model = req.model or provider.get("default_model", "")
    
    if not base_url:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {req.provider_id}")
    
    start_time = time.time()
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 根据 API 格式发送不同请求
            if req.api_format == "openai":
                result = await _test_openai_format(client, base_url, req.api_key, model)
            elif req.api_format == "anthropic":
                result = await _test_anthropic_format(client, base_url, req.api_key, model)
            elif req.api_format == "gemini":
                result = await _test_gemini_format(client, base_url, req.api_key, model)
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported format: {req.api_format}")
        
        latency = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "latency_ms": latency,
            "message": "连接成功",
            "response": result,
        }
        
    except httpx.HTTPStatusError as e:
        error_detail = e.response.text[:500] if e.response else str(e)
        return {
            "success": False,
            "latency_ms": int((time.time() - start_time) * 1000),
            "message": f"HTTP {e.response.status_code}: {error_detail}",
        }
    except Exception as e:
        return {
            "success": False,
            "latency_ms": int((time.time() - start_time) * 1000),
            "message": str(e),
        }


@app.post("/models")
async def fetch_models(req: FetchModelsRequest):
    """
    获取 Provider 的模型列表
    代理 /v1/models 端点
    """
    provider = PROVIDER_CONFIG.get(req.provider_id, {})
    base_url = req.base_url or provider.get("base_url", "")
    
    if not base_url:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {req.provider_id}")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {}
            if req.api_key:
                headers["Authorization"] = f"Bearer {req.api_key}"
            
            response = await client.get(f"{base_url}/models", headers=headers)
            response.raise_for_status()
            
            data = response.json()
            
            # 标准化模型列表格式
            models = []
            if "data" in data:
                for m in data["data"]:
                    try:
                        model_id = m.get("id") or ""
                        if not model_id:
                            continue
                        # 从 id 提取友好名称: openai/gpt-4o → GPT-4o
                        name = model_id.split("/")[-1] if "/" in model_id else model_id
                        # 美化名称: gpt-4o → GPT-4o
                        name = name.replace("-", " ").replace("_", " ").title()
                        models.append({
                            "id": model_id,
                            "name": name or model_id,
                        })
                    except Exception:
                        # 单个模型解析失败，跳过
                        continue
            
            return {"success": True, "models": models}
            
    except Exception as e:
        return {"success": False, "message": str(e), "models": []}


# ============ 内部函数 ============

async def _test_openai_format(client: httpx.AsyncClient, base_url: str, api_key: str, model: str):
    """OpenAI 兼容格式测试"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 5,
    }
    
    response = await client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
    response.raise_for_status()
    return response.json()


async def _test_anthropic_format(client: httpx.AsyncClient, base_url: str, api_key: str, model: str):
    """Anthropic 格式测试"""
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 5,
    }
    
    response = await client.post(f"{base_url}/messages", headers=headers, json=payload)
    response.raise_for_status()
    return response.json()


async def _test_gemini_format(client: httpx.AsyncClient, base_url: str, api_key: str, model: str):
    """Gemini 格式测试"""
    url = f"{base_url}/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": "Hi"}]}],
        "generationConfig": {"maxOutputTokens": 5},
    }
    
    response = await client.post(url, json=payload)
    response.raise_for_status()
    return response.json()


# ============ 启动 ============

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Provider Proxy Server...")
    print("📍 http://localhost:8000")
    print("📍 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
