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
import { getStrategy, defaultParseModelsResponse } from './strategies';

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
                    model: model || '',
                    base_url: baseUrl || provider.baseUrl,
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
        const strategy = getStrategy(provider.apiFormat);
        const targetModel = model || '';

        // If no model provided, we cannot test (user must select model first)
        if (!targetModel) {
            return {
                success: false,
                latencyMs: 0,
                message: '请先选择模型 (Please select a model)'
            };
        }

        const headers = strategy.buildHeaders(apiKey);
        // 使用聊天接口进行测试，发送最简单的请求
        const testPayload = strategy.buildChatPayload(targetModel, [{ role: 'user', content: 'Hi' }]);
        const endpoint = strategy.getChatEndpoint(actualBaseUrl, apiKey, targetModel);

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
    const { provider, apiKey, baseUrl, proxyUrl, fallbackToStatic = true } = options;

    // If proxy URL is provided, use it
    if (proxyUrl) {
        try {
            const response = await fetch(`${proxyUrl}/models`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider_id: provider.id,
                    api_key: apiKey || undefined,
                    base_url: baseUrl || provider.baseUrl,
                }),
            });
            const data = await response.json();
            if (data.success && data.models?.length > 0) {
                return data.models;
            }
        } catch (error) {
            console.warn('Failed to fetch models via proxy:', error);
            if (!fallbackToStatic) throw error;
        }
    }

    // Direct API call
    if (!proxyUrl && provider.supportsModelsApi) {
        try {
            const strategy = getStrategy(provider.apiFormat);
            if (strategy.getModelsEndpoint) {
                const endpoint = strategy.getModelsEndpoint(baseUrl || provider.baseUrl, apiKey || '');
                const headers = strategy.buildHeaders(apiKey || '');

                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers
                });

                if (response.ok) {
                    const data = await response.json();
                    const parser = strategy.parseModelsResponse || defaultParseModelsResponse;
                    return parser(data);
                } else {
                    if (!fallbackToStatic) throw new Error(`HTTP ${response.status}`);
                }
            }
        } catch (e) {
            console.warn('Failed to fetch models directly:', e);
            if (!fallbackToStatic) throw e;
        }
    }

    if (!fallbackToStatic && provider.supportsModelsApi) {
        throw new Error('Failed to fetch models');
    }

    // Fallback to static models
    return getStaticModels(provider.id);
}
