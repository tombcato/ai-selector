import type { Provider, Model } from './types';

export interface ProviderStrategy {
    format: string;
    // 模型列表
    getModelsEndpoint?: (baseUrl: string, apiKey: string) => string;
    parseModelsResponse?: (data: any) => Model[];
    // 聊天 (也用于连接测试)
    getChatEndpoint: (baseUrl: string, apiKey: string, model: string) => string;
    buildChatPayload: (model: string, messages: Array<{ role: string; content: string }>, maxTokens: number) => Record<string, unknown>;
    parseChatResponse: (data: any) => string;
    // Headers
    buildHeaders: (apiKey: string) => Record<string, string>;
}

export const defaultParseModelsResponse = (data: any): Model[] => {
    if (Array.isArray(data?.data)) {
        return data.data
            .filter((m: any) => m.id)
            .map((m: any) => {
                const name =
                    m.name ||
                    (m.id.split('/').pop() ?? '')
                        .replace(/[-_]/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase());
                return {
                    id: m.id,
                    name,
                    created: m.created || 0,
                } as any;
            })
            .sort((a: any, b: any) => (b.created || 0) - (a.created || 0)); // 最新的排在前面
    }
    return [];
};

const openaiStrategy: ProviderStrategy = {
    format: 'openai',
    getModelsEndpoint: (baseUrl) => `${baseUrl}/models`,
    getChatEndpoint: (baseUrl) => `${baseUrl}/chat/completions`,
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    }),
    buildChatPayload: (model, messages, maxTokens) => ({
        model,
        messages,
        max_tokens: maxTokens,
    }),
    parseChatResponse: (data) => {
        return data.choices?.[0]?.message?.content || '';
    },
};

const anthropicStrategy: ProviderStrategy = {
    format: 'anthropic',
    getChatEndpoint: (baseUrl) => `${baseUrl}/messages`,
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
    }),
    buildChatPayload: (model, messages, maxTokens) => ({
        model,
        messages,
        max_tokens: maxTokens,
    }),
    parseChatResponse: (data) => {
        return data.content?.[0]?.text || '';
    },
};

const geminiStrategy: ProviderStrategy = {
    format: 'gemini',
    getModelsEndpoint: (baseUrl, apiKey) => `${baseUrl}/models?key=${apiKey}`,
    getChatEndpoint: (baseUrl, apiKey, model) => `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
    buildHeaders: () => ({
        'Content-Type': 'application/json',
    }),
    buildChatPayload: (_model, messages, maxTokens) => {
        // 转换 OpenAI 格式的 messages 为 Gemini 格式
        const contents = messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
        }));
        return {
            contents,
            generationConfig: { maxOutputTokens: maxTokens },
        };
    },
    parseChatResponse: (data) => {
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    },
    // Gemini 返回格式: { models: [{ name: "models/gemini-pro", ... }] }
    parseModelsResponse: (data) => {
        if (Array.isArray(data.models)) {
            return data.models
                .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
                .map((m: any) => ({
                    id: m.name.replace('models/', ''), // "models/gemini-pro" -> "gemini-pro"
                    name: m.displayName || m.name.replace('models/', ''),
                    created: m.created || 0,
                }))
                .sort((a: any, b: any) => (b.created || 0) - (a.created || 0));
        }
        return [];
    },
};

const cohereStrategy: ProviderStrategy = {
    format: 'cohere',
    getModelsEndpoint: (baseUrl) => `${baseUrl}/models`,
    getChatEndpoint: (baseUrl) => `${baseUrl}/chat`,
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    }),
    buildChatPayload: (model, messages, maxTokens) => {
        // Cohere 使用不同的格式: message 是当前消息, chat_history 是历史
        const lastMessage = messages[messages.length - 1];
        const chatHistory = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
            message: m.content,
        }));
        return {
            model,
            message: lastMessage.content,
            chat_history: chatHistory,
            max_tokens: maxTokens,
        };
    },
    parseChatResponse: (data) => {
        return data.text || '';
    },
};

export const strategyRegistry: Record<string, ProviderStrategy> = {
    openai: openaiStrategy,
    anthropic: anthropicStrategy,
    gemini: geminiStrategy,
    cohere: cohereStrategy,
};

export function getStrategy(format: string): ProviderStrategy {
    return strategyRegistry[format] || openaiStrategy;
}

// ============================================================================
// 纯前端直连聊天函数
// ============================================================================

export interface DirectChatOptions {
    apiFormat: string;
    baseUrl: string;
    apiKey: string;
    model: string;
    messages: Array<{ role: string; content: string }>;
    maxTokens?: number;
}

export interface DirectChatResult {
    success: boolean;
    content?: string;
    message?: string;
    latencyMs?: number;
}

/**
 * 纯前端直连 AI 厂商进行聊天
 * 注意: 这会将 API Key 暴露在浏览器中，仅适用于 Demo/测试场景
 */
export async function sendDirectChat(options: DirectChatOptions): Promise<DirectChatResult> {
    const { apiFormat, baseUrl, apiKey, model, messages, maxTokens = 2048 } = options;
    const strategy = getStrategy(apiFormat);

    const endpoint = strategy.getChatEndpoint(baseUrl, apiKey, model);
    const headers = strategy.buildHeaders(apiKey);
    const payload = strategy.buildChatPayload(model, messages, maxTokens);

    const startTime = performance.now();

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });

        const latencyMs = Math.round(performance.now() - startTime);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
                latencyMs,
            };
        }

        const data = await response.json();
        const content = strategy.parseChatResponse(data);

        return {
            success: true,
            content,
            latencyMs,
        };
    } catch (e) {
        return {
            success: false,
            message: e instanceof Error ? e.message : '网络错误',
        };
    }
}

// ============================================================================
// 连接测试函数 (复用聊天接口)
// ============================================================================

export interface TestConnectionOptions {
    apiFormat: string;
    baseUrl: string;
    apiKey: string;
    model: string;
}

export interface TestConnectionResult {
    success: boolean;
    latencyMs?: number;
    message?: string;
}

/**
 * 测试 AI 厂商连接 (通过发送一个简单的聊天请求)
 */
export async function testDirectConnection(options: TestConnectionOptions): Promise<TestConnectionResult> {
    const result = await sendDirectChat({
        apiFormat: options.apiFormat,
        baseUrl: options.baseUrl,
        apiKey: options.apiKey,
        model: options.model,
        messages: [{ role: 'user', content: 'Hi' }],
        maxTokens: 5, // 最小 token 数，节省成本
    });

    return {
        success: result.success,
        latencyMs: result.latencyMs,
        message: result.success ? undefined : result.message,
    };
}
