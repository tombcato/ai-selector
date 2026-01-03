/**
 * AI Provider Selector - Provider Definitions
 * All supported AI providers metadata
 */

import type { Provider } from './types';

const ICON_CDN_BASE = 'https://registry.npmmirror.com/@lobehub/icons-static-svg/1.77.0/files/icons';

// Provider IDs
export const PROVIDER_ID = {
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    GEMINI: 'gemini',
    DEEPSEEK: 'deepseek',
    OPENROUTER: 'openrouter',
    GROQ: 'groq',
    MISTRAL: 'mistral',
    MOONSHOT: 'moonshot',
    QWEN: 'qwen',
    ZHIPU: 'zhipu',
    SILICONFLOW: 'siliconflow',
    XAI: 'xai',
    TOGETHER: 'together',
    FIREWORKS: 'fireworks',
    DEEPINFRA: 'deepinfra',
    PERPLEXITY: 'perplexity',
    COHERE: 'cohere',
    OLLAMA: 'ollama',
    DOUBAO: 'doubao',
    MINIMAX: 'minimax',
} as const;

export type ProviderId = typeof PROVIDER_ID[keyof typeof PROVIDER_ID];

export const PROVIDERS: Record<string, Provider> = {
    [PROVIDER_ID.OPENAI]: {
        id: PROVIDER_ID.OPENAI,
        name: 'OpenAI',
        baseUrl: 'https://api.openai.com/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/openai.svg`,
    },
    [PROVIDER_ID.ANTHROPIC]: {
        id: PROVIDER_ID.ANTHROPIC,
        name: 'Anthropic (Claude)',
        baseUrl: 'https://api.anthropic.com/v1',
        needsApiKey: true,
        apiFormat: 'anthropic',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/anthropic.svg`,
    },
    [PROVIDER_ID.GEMINI]: {
        id: PROVIDER_ID.GEMINI,
        name: 'Google Gemini',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        needsApiKey: true,
        apiFormat: 'gemini',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/gemini.svg`,
    },
    [PROVIDER_ID.OPENROUTER]: {
        id: PROVIDER_ID.OPENROUTER,
        name: 'OpenRouter',
        baseUrl: 'https://openrouter.ai/api/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/openrouter.svg`,
    },
    [PROVIDER_ID.DEEPSEEK]: {
        id: PROVIDER_ID.DEEPSEEK,
        name: 'DeepSeek',
        baseUrl: 'https://api.deepseek.com',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/deepseek.svg`,
    },
    [PROVIDER_ID.MOONSHOT]: {
        id: PROVIDER_ID.MOONSHOT,
        name: 'Moonshot (Kimi)',
        baseUrl: 'https://api.moonshot.cn/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/moonshot.svg`,
    },
    [PROVIDER_ID.QWEN]: {
        id: PROVIDER_ID.QWEN,
        name: '通义千问 (Qwen)',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/qwen.svg`,
    },
    [PROVIDER_ID.ZHIPU]: {
        id: PROVIDER_ID.ZHIPU,
        name: '智谱 AI (GLM)',
        baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/zhipu.svg`,
    },
    [PROVIDER_ID.SILICONFLOW]: {
        id: PROVIDER_ID.SILICONFLOW,
        name: '硅基流动 (siliconflow)',
        baseUrl: 'https://api.siliconflow.cn/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/siliconcloud.svg`,
    },

    [PROVIDER_ID.DOUBAO]: {
        id: PROVIDER_ID.DOUBAO,
        name: '火山方舟 (Doubao)',
        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/doubao.svg`,
    },
    [PROVIDER_ID.MINIMAX]: {
        id: PROVIDER_ID.MINIMAX,
        name: 'MiniMax',
        baseUrl: 'https://api.minimax.io/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: false,
        icon: `${ICON_CDN_BASE}/minimax.svg`,
    },
    [PROVIDER_ID.XAI]: {
        id: PROVIDER_ID.XAI,
        name: 'xAI (Grok)',
        baseUrl: 'https://api.x.ai/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/grok.svg`,
    },
    [PROVIDER_ID.GROQ]: {
        id: PROVIDER_ID.GROQ,
        name: 'Groq',
        baseUrl: 'https://api.groq.com/openai/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/groq.svg`,
    },
    [PROVIDER_ID.MISTRAL]: {
        id: PROVIDER_ID.MISTRAL,
        name: 'Mistral AI',
        baseUrl: 'https://api.mistral.ai/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/mistral.svg`,
    },
    [PROVIDER_ID.TOGETHER]: {
        id: PROVIDER_ID.TOGETHER,
        name: 'Together AI',
        baseUrl: 'https://api.together.xyz/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/together.svg`,
    },
    [PROVIDER_ID.FIREWORKS]: {
        id: PROVIDER_ID.FIREWORKS,
        name: 'Fireworks AI',
        baseUrl: 'https://api.fireworks.ai/inference/v1',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/fireworks.svg`,
    },
    [PROVIDER_ID.DEEPINFRA]: {
        id: PROVIDER_ID.DEEPINFRA,
        name: 'DeepInfra',
        baseUrl: 'https://api.deepinfra.com/v1/openai',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/deepinfra.svg`,
    },
    [PROVIDER_ID.PERPLEXITY]: {
        id: PROVIDER_ID.PERPLEXITY,
        name: 'Perplexity',
        baseUrl: 'https://api.perplexity.ai',
        needsApiKey: true,
        apiFormat: 'openai',
        supportsModelsApi: false,
        icon: `${ICON_CDN_BASE}/perplexity.svg`,
    },
    [PROVIDER_ID.COHERE]: {
        id: PROVIDER_ID.COHERE,
        name: 'Cohere',
        baseUrl: 'https://api.cohere.com/v2',
        needsApiKey: true,
        apiFormat: 'cohere',
        supportsModelsApi: true,
        icon: `${ICON_CDN_BASE}/cohere.svg`,
    },
    [PROVIDER_ID.OLLAMA]: {
        id: PROVIDER_ID.OLLAMA,
        name: 'Ollama (Local)',
        baseUrl: 'http://localhost:11434/v1',
        needsApiKey: false,
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
