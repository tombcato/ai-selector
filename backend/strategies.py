"""
聊天策略模式实现

每个 API 格式对应一个策略类，负责构建请求和解析响应。
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Type, Optional, Tuple
import httpx

from models import ChatResult


# ============================================================================
# 抽象基类
# ============================================================================

class ChatStrategy(ABC):
    """聊天策略抽象基类"""
    
    # 是否支持 /models 端点
    supports_models_api: bool = True
    
    @abstractmethod
    def build_headers(self, api_key: str) -> Dict[str, str]:
        """构建聊天请求头"""
        pass
    
    @abstractmethod
    def build_endpoint(self, base_url: str, model: str, api_key: str) -> str:
        """构建聊天请求 URL"""
        pass
    
    @abstractmethod
    def build_payload(self, model: str, messages: List[Dict[str, str]], max_tokens: int) -> Dict[str, Any]:
        """构建聊天请求体"""
        pass
    
    @abstractmethod
    def parse_response(self, data: Dict[str, Any], model: str) -> ChatResult:
        """解析聊天响应"""
        pass
    
    def build_models_request(self, base_url: str, api_key: str) -> Tuple[str, Dict[str, str]]:
        """
        构建获取模型列表的请求
        
        Returns:
            (endpoint, headers) 元组
        """
        # 默认实现：OpenAI 兼容格式
        return (
            f"{base_url}/models",
            {"Authorization": f"Bearer {api_key}"} if api_key else {}
        )
    
    def parse_models_response(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        解析模型列表响应
        
        Returns:
            [{"id": "...", "name": "...", "created": ...}, ...]
        """
        models = []
        for m in data.get("data", []):
            model_id = m.get("id")
            if model_id:
                # 优先取 name，取不到则将 id 格式化作为 name
                name = m.get("name") or model_id.split("/")[-1].replace("-", " ").replace("_", " ").title()
                models.append({
                    "id": model_id,
                    "name": name,
                    "created": m.get("created", 0)  # 保留创建时间用于排序
                })
        return models
    
    async def execute(
        self,
        client: httpx.AsyncClient,
        base_url: str,
        api_key: str,
        model: str,
        messages: List[Dict[str, str]],
        max_tokens: int,
    ) -> ChatResult:
        """执行聊天请求 (模板方法)"""
        headers = self.build_headers(api_key)
        endpoint = self.build_endpoint(base_url, model, api_key)
        payload = self.build_payload(model, messages, max_tokens)
        
        response = await client.post(endpoint, headers=headers, json=payload)
        response.raise_for_status()
        return self.parse_response(response.json(), model)
    
    async def fetch_models(
        self,
        client: httpx.AsyncClient,
        base_url: str,
        api_key: str,
    ) -> List[Dict[str, str]]:
        """获取模型列表"""
        if not self.supports_models_api:
            return []
        
        endpoint, headers = self.build_models_request(base_url, api_key)
        response = await client.get(endpoint, headers=headers)
        response.raise_for_status()
        return self.parse_models_response(response.json())


# ============================================================================
# 策略实现
# ============================================================================

class OpenAIStrategy(ChatStrategy):
    """OpenAI 兼容格式 (DeepSeek, Groq, Moonshot, etc.)"""
    
    def build_headers(self, api_key: str) -> Dict[str, str]:
        return {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    
    def build_endpoint(self, base_url: str, model: str, api_key: str) -> str:
        return f"{base_url}/chat/completions"
    
    def build_payload(self, model: str, messages: List[Dict[str, str]], max_tokens: int) -> Dict[str, Any]:
        return {"model": model, "messages": messages, "max_tokens": max_tokens}
    
    def parse_response(self, data: Dict[str, Any], model: str) -> ChatResult:
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "") if data.get("choices") else ""
        usage = data.get("usage", {})
        return ChatResult(
            raw_response=data, content=content, model=data.get("model", model),
            usage={"prompt_tokens": usage.get("prompt_tokens", 0), "completion_tokens": usage.get("completion_tokens", 0), "total_tokens": usage.get("total_tokens", 0)}
        )


class AnthropicStrategy(ChatStrategy):
    """Anthropic Claude 格式"""
    
    # Anthropic 不提供 /models 端点
    supports_models_api = False
    
    def build_headers(self, api_key: str) -> Dict[str, str]:
        return {"x-api-key": api_key, "anthropic-version": "2023-06-01", "Content-Type": "application/json"}
    
    def build_endpoint(self, base_url: str, model: str, api_key: str) -> str:
        return f"{base_url}/messages"
    
    def build_payload(self, model: str, messages: List[Dict[str, str]], max_tokens: int) -> Dict[str, Any]:
        return {"model": model, "messages": messages, "max_tokens": max_tokens}
    
    def parse_response(self, data: Dict[str, Any], model: str) -> ChatResult:
        content = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
        usage = data.get("usage", {})
        inp, out = usage.get("input_tokens", 0), usage.get("output_tokens", 0)
        return ChatResult(
            raw_response=data, content=content, model=data.get("model", model),
            usage={"prompt_tokens": inp, "completion_tokens": out, "total_tokens": inp + out}
        )


class GeminiStrategy(ChatStrategy):
    """Google Gemini 格式"""
    
    def build_headers(self, api_key: str) -> Dict[str, str]:
        return {"Content-Type": "application/json"}
    
    def build_endpoint(self, base_url: str, model: str, api_key: str) -> str:
        return f"{base_url}/models/{model}:generateContent?key={api_key}"
    
    def build_payload(self, model: str, messages: List[Dict[str, str]], max_tokens: int) -> Dict[str, Any]:
        contents = [{"role": "user" if m.get("role") == "user" else "model", "parts": [{"text": m.get("content", "")}]} for m in messages]
        return {"contents": contents, "generationConfig": {"maxOutputTokens": max_tokens}}
    
    def parse_response(self, data: Dict[str, Any], model: str) -> ChatResult:
        content = "".join(p.get("text", "") for p in data.get("candidates", [{}])[0].get("content", {}).get("parts", []))
        meta = data.get("usageMetadata", {})
        return ChatResult(
            raw_response=data, content=content, model=model,
            usage={"prompt_tokens": meta.get("promptTokenCount", 0), "completion_tokens": meta.get("candidatesTokenCount", 0), "total_tokens": meta.get("totalTokenCount", 0)}
        )
    
    def build_models_request(self, base_url: str, api_key: str) -> Tuple[str, Dict[str, str]]:
        # Gemini 使用 URL 参数鉴权
        return (f"{base_url}/models?key={api_key}", {})
    


class CohereStrategy(ChatStrategy):
    """Cohere v2 格式"""
    
    def build_headers(self, api_key: str) -> Dict[str, str]:
        return {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    
    def build_endpoint(self, base_url: str, model: str, api_key: str) -> str:
        return f"{base_url}/chat"
    
    def build_payload(self, model: str, messages: List[Dict[str, str]], max_tokens: int) -> Dict[str, Any]:
        return {"model": model, "messages": messages, "max_tokens": max_tokens}
    
    def parse_response(self, data: Dict[str, Any], model: str) -> ChatResult:
        content = "".join(b.get("text", "") for b in data.get("message", {}).get("content", []))
        usage = data.get("usage", {}).get("billed_units", {})
        inp, out = usage.get("input_tokens", 0), usage.get("output_tokens", 0)
        return ChatResult(
            raw_response=data, content=content, model=model,
            usage={"prompt_tokens": inp, "completion_tokens": out, "total_tokens": inp + out}
        )
    


# ============================================================================
# 策略注册表
# ============================================================================

STRATEGY_REGISTRY: Dict[str, Type[ChatStrategy]] = {
    "openai": OpenAIStrategy,
    "anthropic": AnthropicStrategy,
    "gemini": GeminiStrategy,
    "cohere": CohereStrategy,
}


def get_strategy(api_format: str) -> ChatStrategy:
    """根据 API 格式获取策略实例"""
    cls = STRATEGY_REGISTRY.get(api_format)
    if not cls:
        raise ValueError(f"不支持的 API 格式: {api_format}。支持: {', '.join(STRATEGY_REGISTRY.keys())}")
    return cls()
