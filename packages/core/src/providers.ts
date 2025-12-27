/**
 * AI Provider Selector - Provider Definitions
 * All supported AI providers metadata
 */

import type { Provider } from './types';

const ICON_CDN_BASE = 'https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons';

export const PROVIDERS: Record<string, Provider> = {
    openai: {
        id: 'openai',
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/openai.svg`,
    },
    anthropic: {
        id: 'anthropic',
        name: 'Anthropic',
        baseUrl: 'https://api.anthropic.com/v1',
        authType: 'x-api-key',
        apiFormat: 'anthropic',
        supportsModelsApi: false,
        icon: `${ICON_CDN_BASE}/anthropic.svg`,
    },
    gemini: {
        id: 'gemini',
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        authType: 'query-param',
        apiFormat: 'gemini',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/gemini.svg`,
    },
    deepseek: {
        id: 'deepseek',
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/deepseek.svg`,
    },
    openrouter: {
        id: 'openrouter',
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/openrouter.svg`,
    },
    groq: {
        id: 'groq',
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/groq.svg`,
    },
    mistral: {
        id: 'mistral',
        name: 'Mistral AI',
        baseUrl: 'https://api.mistral.ai/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/mistral.svg`,
    },
    moonshot: {
        id: 'moonshot',
        name: 'Moonshot (Kimi)',
        baseUrl: 'https://api.moonshot.cn/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/moonshot.svg`,
    },
    qwen: {
        id: 'qwen',
        name: '通义千问 (Qwen)',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/qwen.svg`,
    },
    zhipu: {
        id: 'zhipu',
        name: '智谱 AI (GLM)',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/zhipu.svg`,
    },
    siliconflow: {
        id: 'siliconflow',
        name: '硅基流动',
        baseUrl: 'https://api.siliconflow.cn/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/siliconcloud.svg`,
    },
    xai: {
        id: 'xai',
        name: 'xAI (Grok)',
        baseUrl: 'https://api.x.ai/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/grok.svg`,
    },
    together: {
        id: 'together',
        name: 'Together AI',
        baseUrl: 'https://api.together.xyz/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/together.svg`,
    },
    fireworks: {
        id: 'fireworks',
        name: 'Fireworks AI',
        baseUrl: 'https://api.fireworks.ai/inference/v1',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/fireworks.svg`,
    },
    deepinfra: {
        id: 'deepinfra',
        name: 'DeepInfra',
        baseUrl: 'https://api.deepinfra.com/v1/openai',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/deepinfra.svg`,
    },
    perplexity: {
        id: 'perplexity',
        name: 'Perplexity',
        baseUrl: 'https://api.perplexity.ai',
        authType: 'bearer',
        apiFormat: 'openai',
        supportsModelsApi: false,
        icon: `${ICON_CDN_BASE}/perplexity.svg`,
    },
    cohere: {
        id: 'cohere',
        name: 'Cohere',
        baseUrl: 'https://api.cohere.com/v2',
        authType: 'bearer',
        apiFormat: 'cohere',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/cohere.svg`,
    },
    ollama: {
        id: 'ollama',
        name: 'Ollama (Local)',
        baseUrl: 'http://localhost:11434/v1',
        authType: 'none',
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/ollama.svg`,
    },
};

/**
 * Get a provider by ID
 */
export function getProvider(id: string): Provider | undefined {
    return PROVIDERS[id];
}

/**
 * Get all providers as an array
 */
export function getAllProviders(): Provider[] {
    return Object.values(PROVIDERS);
}

/**
 * Get providers by API format
 */
export function getProvidersByFormat(format: Provider['apiFormat']): Provider[] {
    return getAllProviders().filter(p => p.apiFormat === format);
}
