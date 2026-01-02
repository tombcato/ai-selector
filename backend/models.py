"""
数据模型定义 (Pydantic)
"""

from dataclasses import dataclass
from typing import Optional, Dict, Any, List
from pydantic import BaseModel


# ============================================================================
# 请求模型
# ============================================================================

class ChatRequest(BaseModel):
    """聊天/测试请求体"""
    provider_id: str
    api_key: str
    model: str
    base_url: str
    api_format: str = "openai"
    messages: Optional[List[Dict[str, str]]] = None
    max_tokens: Optional[int] = None


class FetchModelsRequest(BaseModel):
    """获取模型列表请求体"""
    provider_id: str
    api_key: Optional[str] = None
    base_url: str
    api_format: str = "openai"


# ============================================================================
# 响应模型
# ============================================================================

class TestConnectionResponse(BaseModel):
    """测试连通性响应体"""
    success: bool
    latency_ms: int
    message: str


class ChatResponse(BaseModel):
    """聊天响应体 - 标准化格式"""
    success: bool
    content: Optional[str] = None
    model: Optional[str] = None
    usage: Optional[Dict[str, int]] = None
    latency_ms: int = 0
    raw_response: Optional[Dict[str, Any]] = None
    message: Optional[str] = None


class FetchModelsResponse(BaseModel):
    """获取模型列表响应体"""
    success: bool
    models: List[Dict[str, Any]]
    message: Optional[str] = None


# ============================================================================
# 内部数据类
# ============================================================================

@dataclass
class ChatResult:
    """统一的聊天结果"""
    raw_response: Dict[str, Any]
    content: str
    model: str
    usage: Dict[str, int]
