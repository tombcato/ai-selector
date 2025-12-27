/**
 * AI Provider Selector - Config Resolution
 * Resolves ProviderConfig into a list of providers and models
 */

import type { Provider, Model, ProviderConfig, CustomProviderDefinition } from './types';
import { PROVIDERS } from './providers';
import { getStaticModels } from './models';

export interface ResolvedConfig {
    providers: Provider[];
    getModels: (providerId: string) => Model[];
}

/**
 * Resolve a ProviderConfig into usable providers and models
 */
export function resolveProviderConfig(config?: ProviderConfig): ResolvedConfig {
    // Default config: use all built-in providers
    if (!config) {
        return {
            providers: Object.values(PROVIDERS),
            getModels: (providerId: string) => getStaticModels(providerId),
        };
    }

    const { mode, include, exclude, custom } = config;
    let providers: Provider[] = [];

    // Handle built-in providers based on mode
    if (mode === 'default') {
        let builtInProviders = Object.values(PROVIDERS);

        // Apply include filter
        if (include && include.length > 0) {
            builtInProviders = builtInProviders.filter(p => include.includes(p.id));
        }

        // Apply exclude filter
        if (exclude && exclude.length > 0) {
            builtInProviders = builtInProviders.filter(p => !exclude.includes(p.id));
        }

        providers = [...builtInProviders];
    }

    // Handle custom providers
    const customModelsMap: Record<string, Model[]> = {};

    if (custom) {
        for (const [id, def] of Object.entries(custom)) {
            const customProvider: Provider = {
                id,
                name: def.name,
                baseUrl: def.baseUrl,
                authType: def.authType,
                apiFormat: def.apiFormat,
                supportsModelsApi: def.supportsModelsApi ?? false,
                icon: def.icon,
            };
            providers.push(customProvider);

            // Store custom models if provided
            if (def.models && def.models.length > 0) {
                customModelsMap[id] = def.models;
            }
        }
    }

    // Create getModels function that checks custom models first
    const getModels = (providerId: string): Model[] => {
        // Check custom models first
        if (customModelsMap[providerId]) {
            return customModelsMap[providerId];
        }
        // Fall back to static models
        return getStaticModels(providerId);
    };

    return { providers, getModels };
}

/**
 * Get a single provider by ID from config
 */
export function getProviderFromConfig(providerId: string, config?: ProviderConfig): Provider | null {
    const { providers } = resolveProviderConfig(config);
    return providers.find(p => p.id === providerId) || null;
}
