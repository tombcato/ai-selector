import { useState, useEffect, useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import {
    testConnection,
    createConfigStorage,
    resolveProviderConfig,
    type Model,
    type AIConfig,
    type ProviderConfig,
    type Provider,
    type ModelFetcher,
    type TestConnectionResult
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
    /** Custom fetcher for models and connection check */
    modelFetcher?: ModelFetcher;
}

export interface UseAIConfigReturn {
    config: AIConfig;
    providerId: string;
    apiKey: string;
    model: string;
    modelName: string;
    baseUrl: string;
    models: Model[];
    testStatus: 'idle' | 'testing' | 'success' | 'error';
    testResult: TestConnectionResult | null;
    isFetchingModels: boolean;
    fetchModelError: string | null;
    provider: Provider | null;
    providers: Provider[];
    isValid: boolean;
    setProviderId: (id: string) => void;
    setApiKey: Dispatch<SetStateAction<string>>;
    setModel: Dispatch<SetStateAction<string>>;
    setBaseUrl: Dispatch<SetStateAction<string>>;
    runTest: () => Promise<TestConnectionResult | undefined>;
    save: () => void;
    clear: () => void;
}

export function useAIConfig(options: UseAIConfigOptions = {}): UseAIConfigReturn {
    const [providerId, setProviderId] = useState<string>(options.initialConfig?.providerId || '');
    const [apiKey, setApiKey] = useState<string>(options.initialConfig?.apiKey || '');
    const [model, setModel] = useState<string>(options.initialConfig?.model || '');
    const [modelName, setModelName] = useState<string>(options.initialConfig?.modelName || '');
    const [baseUrl, setBaseUrl] = useState<string>(options.initialConfig?.baseUrl || '');

    const [models, setModels] = useState<Model[]>([]);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
    const [isFetchingModels, setIsFetchingModels] = useState(false);
    const [fetchModelError, setFetchModelError] = useState<string | null>(null);

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

    // In-memory model cache: key = `${providerId}|${baseUrl}|${apiKey}`
    const modelCacheRef = useRef<Map<string, Model[]>>(new Map());

    // Load config from storage on mount
    useEffect(() => {
        const saved = storage.load();
        if (saved) {
            if (saved.providerId) setProviderId(saved.providerId);
            if (saved.apiKey) setApiKey(saved.apiKey);
            if (saved.model) setModel(saved.model);
            if (saved.modelName) setModelName(saved.modelName);
            if (saved.baseUrl) setBaseUrl(saved.baseUrl);
        }
    }, [storage]);

    // Update models (with caching)
    useEffect(() => {
        if (!providerId || !provider) {
            setModels([]);
            setFetchModelError(null);
            setIsFetchingModels(false);
            return;
        }

        const shouldFetch = provider.supportsModelsApi && (!provider.needsApiKey || !!apiKey);
        const actualBaseUrl = baseUrl || provider.baseUrl;
        const cacheKey = `${providerId}|${actualBaseUrl}|${apiKey}`;

        // Check cache first
        const cachedModels = modelCacheRef.current.get(cacheKey);
        if (cachedModels) {
            setModels(cachedModels);
            setFetchModelError(null);
            setIsFetchingModels(false);
            return;
        }

        if (!shouldFetch) {
            // Use static models immediately
            const staticModels = resolvedConfig.getModels(providerId);
            setModels(staticModels);
            modelCacheRef.current.set(cacheKey, staticModels);
            setFetchModelError(null);
            setIsFetchingModels(false);
            return;
        }

        // Set fetching immediately to fill debounce gap
        setIsFetchingModels(true);
        setFetchModelError(null);

        // Pre-fill with static models if empty to avoid flicker
        if (models.length === 0) {
            setModels(resolvedConfig.getModels(providerId));
        }

        const fetchList = async () => {
            try {
                let fetchedModels: Model[];

                if (options.modelFetcher) {
                    fetchedModels = await options.modelFetcher({
                        type: 'fetchModels',
                        providerId: provider.id,
                        baseUrl: actualBaseUrl,
                        apiKey
                    });
                } else {
                    fetchedModels = await import('@ai-selector/core').then(m => m.fetchModels({
                        provider,
                        apiKey,
                        baseUrl: actualBaseUrl,
                        proxyUrl: options.proxyUrl,
                        fallbackToStatic: false
                    }));
                }
                setModels(fetchedModels);
                modelCacheRef.current.set(cacheKey, fetchedModels);
            } catch (e) {
                console.warn('Model fetch failed:', e);
                setFetchModelError('fetchModelsFailed');
                const fallbackModels = resolvedConfig.getModels(providerId);
                setModels(fallbackModels);
                // Don't cache failed results
            } finally {
                setIsFetchingModels(false);
            }
        };

        // Debounce for apiKey changes
        const timer = setTimeout(fetchList, 500);
        return () => clearTimeout(timer);
    }, [providerId, provider, apiKey, baseUrl, resolvedConfig, options.proxyUrl, options.modelFetcher]);

    // ... (rest of hook)



    // Reset test status when apiKey/baseUrl changes while in error state
    useEffect(() => {
        if (testStatus === 'error' || testStatus === 'success') {
            setTestStatus('idle');
            setTestResult(null);
        }
    }, [apiKey, baseUrl]);

    // Test connection
    const runTest = useCallback(async () => {
        if (!provider) return;
        if (provider.needsApiKey && !apiKey) return;

        setTestStatus('testing');
        setTestResult(null);

        let result: TestConnectionResult;

        if (options.modelFetcher) {
            try {
                const fetcherResult = await options.modelFetcher({
                    type: 'checkConnection',
                    providerId: provider.id,
                    baseUrl: baseUrl || provider.baseUrl,
                    apiKey,
                    modelId: model
                });
                // Normalize result if fetcher returns incomplete object
                result = {
                    success: fetcherResult.success,
                    latencyMs: fetcherResult.latency || fetcherResult.latencyMs,
                    message: fetcherResult.message
                };
            } catch (e: any) {
                result = { success: false, message: e.message || 'Unknown error' };
            }
        } else {
            result = await testConnection({
                provider,
                apiKey,
                baseUrl,
                model,
                proxyUrl: options.proxyUrl
            });
        }

        setTestResult(result);
        setTestStatus(result.success ? 'success' : 'error');

        // Auto-revert status to idle (always 2s)
        setTimeout(() => {
            setTestStatus('idle');
        }, 2000);

        return result;
        return result;
    }, [provider, apiKey, baseUrl, model, options.proxyUrl, options.modelFetcher]);

    // Save config
    const save = useCallback(() => {
        // Find model name from current list or use existing state
        const foundModel = models.find(m => m.id === model);
        const nameToSave = foundModel?.name || modelName || model;

        // Update state if we found a better name
        if (foundModel?.name && foundModel.name !== modelName) {
            setModelName(foundModel.name);
        }

        storage.save({
            providerId,
            apiKey,
            model,
            modelName: nameToSave,
            baseUrl
        });
    }, [providerId, apiKey, model, modelName, baseUrl, models, storage]);

    // Clear config
    const clear = useCallback(() => {
        storage.clear();
        setProviderId('');
        setApiKey('');
        setModel('');
        setModelName('');
        setBaseUrl('');
    }, [storage]);

    // Change provider and reset related fields
    const changeProviderId = useCallback((id: string) => {
        setProviderId(id);
        setApiKey('');
        setModel('');
        setModelName('');
        setBaseUrl('');
        setTestStatus('idle');
        setTestResult(null);
    }, []);

    // Derived state
    const isValid = useMemo(() => {
        if (!providerId || !model) return false;
        if (provider?.needsApiKey && !apiKey) return false;
        return true;
    }, [providerId, model, provider, apiKey]);

    // Get current config
    const currentConfig: AIConfig = useMemo(() => ({
        providerId,
        apiKey,
        model,
        modelName,
        baseUrl: baseUrl || provider?.baseUrl || ''
    }), [providerId, apiKey, model, modelName, baseUrl, provider]);

    return {
        // State
        config: currentConfig,
        providerId,
        apiKey,
        model,
        modelName,
        baseUrl,
        models,
        testStatus,
        testResult,
        isFetchingModels,
        fetchModelError,
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
