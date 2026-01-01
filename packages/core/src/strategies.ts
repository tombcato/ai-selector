import type { Provider, Model } from './types';

export interface ProviderStrategy {
    format: string;
    getTestEndpoint: (baseUrl: string, apiKey: string, model: string) => string;
    getModelsEndpoint?: (baseUrl: string, apiKey: string) => string;
    buildHeaders: (apiKey: string) => Record<string, string>;
    buildTestPayload: (model: string) => Record<string, unknown>;
    parseModelsResponse?: (data: any) => Model[];
}

export const defaultParseModelsResponse =  (data: any) => {
    if (Array.isArray(data.data)) {
        return data.data.map((m: any) => ({
            id: m.id,
            name: m.id,
        }));
    }
    return [];
};

const openaiStrategy: ProviderStrategy = {
    format: 'openai',
    getTestEndpoint: (baseUrl) => `${baseUrl}/chat/completions`,
    getModelsEndpoint: (baseUrl) => `${baseUrl}/models`,
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    }),
    buildTestPayload: (model) => ({
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
    }),
};

const anthropicStrategy: ProviderStrategy = {
    format: 'anthropic',
    getTestEndpoint: (baseUrl) => `${baseUrl}/messages`,
    // Anthropic does not have a public models endpoint compatible with this flow easily
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
    }),
    buildTestPayload: (model) => ({
        model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
    }),
};

const geminiStrategy: ProviderStrategy = {
    format: 'gemini',
    getTestEndpoint: (baseUrl, apiKey, model) => `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
    getModelsEndpoint: (baseUrl, apiKey) => `${baseUrl}/models?key=${apiKey}`,
    buildHeaders: () => ({
        'Content-Type': 'application/json',
    }),
    buildTestPayload: () => ({
        contents: [{ parts: [{ text: 'Hi' }] }],
        generationConfig: { maxOutputTokens: 5 },
    }),
};

const cohereStrategy: ProviderStrategy = {
    format: 'cohere',
    getTestEndpoint: (baseUrl) => `${baseUrl}/chat`,
    getModelsEndpoint: (baseUrl) => `${baseUrl}/models`,
    buildHeaders: (apiKey) => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    }),
    buildTestPayload: (model) => ({
        model,
        message: 'Hi',
        max_tokens: 5,
    }),
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


