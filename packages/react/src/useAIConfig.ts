import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    testConnection,
    fetchModels,
    createConfigStorage,
    resolveProviderConfig,
    type Model,
    type AIConfig,
    type TestConnectionResult,
    type ProviderConfig,
    type Provider
} from '@ai-selector/core';

export interface UseAIConfigOptions {
    /** Optional proxy URL for API requests */
    proxyUrl?: string;
    /** Initial configuration */
    initialConfig?: Partial<AIConfig>;
    /** Provider configuration (filtering, custom providers) */
    providerConfig?: ProviderConfig;
    /** callbacks for custom storage serialization */
    onSerialize?: (data: any) => string;
    onDeserialize?: (data: string) => any;
}

export function useAIConfig(options: UseAIConfigOptions = {}) {
    const [providerId, setProviderId] = useState<string>(options.initialConfig?.providerId || '');
    const [apiKey, setApiKey] = useState<string>(options.initialConfig?.apiKey || '');
    const [model, setModel] = useState<string>(options.initialConfig?.model || '');
    const [baseUrl, setBaseUrl] = useState<string>(options.initialConfig?.baseUrl || '');

    const [models, setModels] = useState<Model[]>([]);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);

    // Resolve provider config
    const resolvedConfig = useMemo(
        () => resolveProviderConfig(options.providerConfig),
        [options.providerConfig]
    );

    const allProviders = resolvedConfig.providers;
    const provider = useMemo(
        () => allProviders.find(p => p.id === providerId) || null,
        [allProviders, providerId]
    );

    const storage = useMemo(() => createConfigStorage(undefined, {
        serialize: options.onSerialize,
        deserialize: options.onDeserialize
    }), [options.onSerialize, options.onDeserialize]);

    // Load config from storage on mount
    useEffect(() => {
        const saved = storage.load();
        if (saved) {
            // Only load if the provider exists in current config
            if (saved.providerId && allProviders.some(p => p.id === saved.providerId)) {
                setProviderId(saved.providerId);
                if (saved.apiKey) setApiKey(saved.apiKey);
                if (saved.model) setModel(saved.model);
                if (saved.baseUrl) setBaseUrl(saved.baseUrl);
            }
        }
    }, [storage, allProviders]);

    // Fetch models when provider/auth changes
    useEffect(() => {
        if (!provider) {
            setModels([]);
            return;
        }

        // First try to get custom models from config
        const customModels = resolvedConfig.getModels(provider.id);

        // Don't fetch if we need a key but don't have one
        if (provider.authType !== 'none' && !apiKey) {
            setModels(customModels);
            return;
        }

        // If we have custom models and provider doesn't support API, use them
        if (customModels.length > 0 && !provider.supportsModelsApi) {
            setModels(customModels);
            return;
        }

        const loadModels = async () => {
            const fetched = await fetchModels({
                provider,
                apiKey,
                baseUrl,
                proxyUrl: options.proxyUrl
            });
            // If fetch returns empty, fall back to custom/static models
            setModels(fetched.length > 0 ? fetched : customModels);
        };

        loadModels();
    }, [provider, apiKey, baseUrl, options.proxyUrl, resolvedConfig]);

    // Test connection
    const runTest = useCallback(async () => {
        if (!provider) return;
        if (provider.authType !== 'none' && !apiKey) return;

        setTestStatus('testing');
        setTestResult(null);

        const result = await testConnection({
            provider,
            apiKey,
            baseUrl,
            model,
            proxyUrl: options.proxyUrl
        });

        setTestStatus(result.success ? 'success' : 'error');
        setTestResult(result);
        return result;
    }, [provider, apiKey, baseUrl, model, options.proxyUrl]);

    // Save config
    const save = useCallback(() => {
        storage.save({ providerId, apiKey, model, baseUrl });
    }, [providerId, apiKey, model, baseUrl, storage]);

    // Clear config
    const clear = useCallback(() => {
        storage.clear();
        setProviderId('');
        setApiKey('');
        setModel('');
        setBaseUrl('');
    }, [storage]);

    // Change provider and reset related fields
    const changeProviderId = useCallback((id: string) => {
        setProviderId(id);
        setApiKey('');
        setModel('');
        setBaseUrl('');
        setTestStatus('idle');
        setTestResult(null);
    }, []);

    // Derived state
    const isValid = useMemo(() => {
        if (!providerId || !model) return false;
        if (provider?.authType !== 'none' && !apiKey) return false;
        return true;
    }, [providerId, model, provider, apiKey]);

    // Get current config
    const currentConfig: AIConfig = useMemo(() => ({
        providerId,
        apiKey,
        model,
        baseUrl: baseUrl || provider?.baseUrl || ''
    }), [providerId, apiKey, model, baseUrl, provider]);

    return {
        // State
        config: currentConfig,
        providerId,
        apiKey,
        model,
        baseUrl,
        models,
        testStatus,
        testResult,
        provider,
        providers: allProviders,
        isValid,

        // Actions
        setProviderId: changeProviderId,
        setApiKey,
        setModel,
        setBaseUrl,
        runTest,
        save,
        clear,
    };
}
