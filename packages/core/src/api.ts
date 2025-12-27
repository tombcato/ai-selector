/**
 * AI Provider Selector - API Functions
 * Connection testing and model fetching logic
 */

import type {
    Provider,
    Model,
    TestConnectionOptions,
    TestConnectionResult,
    FetchModelsOptions
} from './types';
import { getStaticModels } from './models';

const DEFAULT_TIMEOUT = 30000;

/**
 * Test connection to an AI provider
 */
export async function testConnection(options: TestConnectionOptions): Promise<TestConnectionResult> {
    const { provider, apiKey, model, baseUrl, proxyUrl } = options;
    const actualBaseUrl = baseUrl || provider.baseUrl;
    const startTime = Date.now();

    try {
        // If proxy URL is provided, use it
        if (proxyUrl) {
            const response = await fetch(`${proxyUrl}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: provider.id,
                    api_key: apiKey,
                    model: model || undefined,
                    base_url: baseUrl || undefined,
                    api_format: provider.apiFormat,
                }),
            });
            const data = await response.json();
            return {
                success: data.success,
                latencyMs: data.latency_ms || (Date.now() - startTime),
                message: data.message,
            };
        }

        // Direct API call (for browser-compatible providers)
        // Note: Most providers don't support CORS, so proxy is recommended
        const headers = buildHeaders(provider, apiKey);
        const testPayload = buildTestPayload(provider, model);
        const endpoint = getTestEndpoint(provider, actualBaseUrl, apiKey, model);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(testPayload),
        });

        const latencyMs = Date.now() - startTime;

        if (response.ok) {
            return { success: true, latencyMs, message: '连接成功' };
        } else {
            const errorText = await response.text();
            return {
                success: false,
                latencyMs,
                message: `HTTP ${response.status}: ${errorText.slice(0, 200)}`
            };
        }
    } catch (error) {
        return {
            success: false,
            latencyMs: Date.now() - startTime,
            message: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * Fetch available models from a provider
 */
export async function fetchModels(options: FetchModelsOptions): Promise<Model[]> {
    const { provider, apiKey, baseUrl, proxyUrl } = options;

    // If proxy URL is provided, use it
    if (proxyUrl) {
        try {
            const response = await fetch(`${proxyUrl}/models`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: provider.id,
                    api_key: apiKey || undefined,
                    base_url: baseUrl || undefined,
                }),
            });
            const data = await response.json();
            if (data.success && data.models?.length > 0) {
                return data.models;
            }
        } catch (error) {
            console.warn('Failed to fetch models via proxy:', error);
        }
    }

    // Fallback to static models
    return getStaticModels(provider.id);
}

// ============ Helper Functions ============

function buildHeaders(provider: Provider, apiKey: string): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    switch (provider.authType) {
        case 'bearer':
            headers['Authorization'] = `Bearer ${apiKey}`;
            break;
        case 'x-api-key':
            headers['x-api-key'] = apiKey;
            if (provider.apiFormat === 'anthropic') {
                headers['anthropic-version'] = '2023-06-01';
            }
            break;
        // query-param and none don't need headers
    }

    return headers;
}

function buildTestPayload(provider: Provider, model?: string): Record<string, unknown> {
    const defaultModel = model || getDefaultModel(provider.id);

    switch (provider.apiFormat) {
        case 'anthropic':
            return {
                model: defaultModel,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 5,
            };
        case 'gemini':
            return {
                contents: [{ parts: [{ text: 'Hi' }] }],
                generationConfig: { maxOutputTokens: 5 },
            };
        case 'cohere':
            return {
                model: defaultModel,
                message: 'Hi',
                max_tokens: 5,
            };
        case 'openai':
        default:
            return {
                model: defaultModel,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 5,
            };
    }
}

function getTestEndpoint(provider: Provider, baseUrl: string, apiKey: string, model?: string): string {
    const defaultModel = model || getDefaultModel(provider.id);

    switch (provider.apiFormat) {
        case 'anthropic':
            return `${baseUrl}/messages`;
        case 'gemini':
            return `${baseUrl}/models/${defaultModel}:generateContent?key=${apiKey}`;
        case 'cohere':
            return `${baseUrl}/chat`;
        case 'openai':
        default:
            return `${baseUrl}/chat/completions`;
    }
}

function getDefaultModel(providerId: string): string {
    const defaults: Record<string, string> = {
        openai: 'gpt-4o-mini',
        anthropic: 'claude-3-haiku-20240307',
        gemini: 'gemini-1.5-flash',
        deepseek: 'deepseek-chat',
        groq: 'llama-3.1-8b-instant',
        mistral: 'mistral-small-latest',
        openrouter: 'google/gemini-2.0-flash-exp:free',
    };
    return defaults[providerId] || '';
}
