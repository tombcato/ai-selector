import { useState, useEffect, useCallback, useMemo, useRef, type Dispatch, type SetStateAction } from 'react';
import {
    testConnection,
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

export interface UseAIConfigReturn {
    config: AIConfig;
    providerId: string;
    apiKey: string;
    model: string;
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

        const fetchList = async () => {
            try {
                const fetchedModels = await import('@ai-selector/core').then(m => m.fetchModels({
                    provider,
                    apiKey,
                    baseUrl: actualBaseUrl,
                    proxyUrl: options.proxyUrl,
                    fallbackToStatic: false
                }));
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
    }, [providerId, provider, apiKey, baseUrl, resolvedConfig, options.proxyUrl]);

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

        const result = await testConnection({
            provider,
            apiKey,
            baseUrl,
            model,
            proxyUrl: options.proxyUrl
        });

        setTestResult(result);
        setTestStatus(result.success ? 'success' : 'error');

        // Auto-revert status to idle (always 2s)
        setTimeout(() => {
            setTestStatus('idle');
        }, 2000);

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
        if (provider?.needsApiKey && !apiKey) return false;
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
