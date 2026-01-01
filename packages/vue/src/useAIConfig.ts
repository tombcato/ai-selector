import { ref, computed, watch, onMounted } from 'vue';
import {
    testConnection,
    createConfigStorage,
    resolveProviderConfig,
    type Model,
    type AIConfig,
    type TestConnectionResult,
    type ProviderConfig,
    fetchModels
} from '@ai-selector/core';

export interface UseAIConfigOptions {
    proxyUrl?: string;
    initialConfig?: Partial<AIConfig>;
    providerConfig?: ProviderConfig;
    onSerialize?: (data: any) => string;
    onDeserialize?: (data: string) => any;
}

export function useAIConfig(options: UseAIConfigOptions = {}) {
    const providerId = ref(options.initialConfig?.providerId || '');
    const apiKey = ref(options.initialConfig?.apiKey || '');
    const model = ref(options.initialConfig?.model || '');
    const baseUrl = ref(options.initialConfig?.baseUrl || '');

    const models = ref<Model[]>([]);
    const testStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle');
    const testResult = ref<TestConnectionResult | null>(null);
    const isFetchingModels = ref(false);
    const fetchModelError = ref<string | null>(null);

    // Resolve provider config
    const resolvedConfig = computed(() => resolveProviderConfig(options.providerConfig));
    const allProviders = computed(() => resolvedConfig.value.providers);

    const provider = computed(() =>
        allProviders.value.find(p => p.id === providerId.value) || null
    );

    const storage = createConfigStorage(undefined, {
        serialize: options.onSerialize,
        deserialize: options.onDeserialize
    });

    // Flag to prevent clearing data during initial load
    const isLoaded = ref(false);

    // Load config
    onMounted(() => {
        const saved = storage.load();
        if (saved) {
            // Only load if provider exists in current config
            if (saved.providerId && allProviders.value.some(p => p.id === saved.providerId)) {
                providerId.value = saved.providerId;
                if (saved.apiKey) apiKey.value = saved.apiKey;
                if (saved.model) model.value = saved.model;
                if (saved.baseUrl) baseUrl.value = saved.baseUrl;
            }
        }
        setTimeout(() => { isLoaded.value = true; }, 0);
    });

    // Watch for provider changes to reset fields
    watch(providerId, () => {
        if (!isLoaded.value) return;
        apiKey.value = '';
        model.value = '';
        baseUrl.value = '';
        testStatus.value = 'idle';
        testResult.value = null;
    });

    // Watch for provider/apikey/baseurl to update models (with caching)
    let fetchTimer: any = null;
    const modelCache = new Map<string, Model[]>();

    watch([providerId, apiKey, baseUrl], () => {
        if (fetchTimer) clearTimeout(fetchTimer);

        if (!providerId.value || !provider.value) {
            models.value = [];
            fetchModelError.value = null;
            isFetchingModels.value = false;
            return;
        }

        const shouldFetch = provider.value.supportsModelsApi && (!provider.value.needsApiKey || !!apiKey.value);
        const actualBaseUrl = baseUrl.value || provider.value.baseUrl;
        const cacheKey = `${providerId.value}|${actualBaseUrl}|${apiKey.value}`;

        // Check cache first
        const cachedModels = modelCache.get(cacheKey);
        if (cachedModels) {
            models.value = cachedModels;
            fetchModelError.value = null;
            isFetchingModels.value = false;
            return;
        }

        if (!shouldFetch) {
            const staticModels = resolvedConfig.value.getModels(providerId.value);
            models.value = staticModels;
            modelCache.set(cacheKey, staticModels);
            fetchModelError.value = null;
            isFetchingModels.value = false;
            return;
        }

        // Set fetching immediately to fill debounce gap
        isFetchingModels.value = true;
        fetchModelError.value = null;

        fetchTimer = setTimeout(async () => {
            try {
                const fetchedModels = await fetchModels({
                    provider: provider.value!,
                    apiKey: apiKey.value,
                    baseUrl: actualBaseUrl,
                    proxyUrl: options.proxyUrl,
                    fallbackToStatic: false
                });
                models.value = fetchedModels;
                modelCache.set(cacheKey, fetchedModels);
            } catch (e) {
                console.warn('Model fetch failed:', e);
                fetchModelError.value = 'fetchModelsFailed';
                models.value = resolvedConfig.value.getModels(providerId.value);
                // Don't cache failed results
            } finally {
                isFetchingModels.value = false;
            }
        }, 500);
    }, { immediate: true });

    // Reset test status when apiKey/baseUrl changes while in error/success state
    watch([apiKey, baseUrl], () => {
        if (testStatus.value === 'error' || testStatus.value === 'success') {
            testStatus.value = 'idle';
            testResult.value = null;
        }
    });

    // Actions
    async function runTest() {
        if (!provider.value) return;
        if (provider.value.needsApiKey && !apiKey.value) return;

        testStatus.value = 'testing';
        testResult.value = null;

        const result = await testConnection({
            provider: provider.value,
            apiKey: apiKey.value,
            baseUrl: baseUrl.value,
            model: model.value,
            proxyUrl: options.proxyUrl
        });

        testResult.value = result;
        testStatus.value = result.success ? 'success' : 'error';

        // Auto-revert to idle (always 2s)
        setTimeout(() => {
            testStatus.value = 'idle';
        }, 2000);

        return result;
    }

    function save() {
        storage.save({
            providerId: providerId.value,
            apiKey: apiKey.value,
            model: model.value,
            baseUrl: baseUrl.value
        });
    }

    function clear() {
        storage.clear();
        providerId.value = '';
        apiKey.value = '';
        model.value = '';
        baseUrl.value = '';
    }

    const isValid = computed(() => {
        if (!providerId.value || !model.value) return false;
        if (provider.value?.needsApiKey && !apiKey.value) return false;
        return true;
    });

    const currentConfig = computed<AIConfig>(() => ({
        providerId: providerId.value,
        apiKey: apiKey.value,
        model: model.value,
        baseUrl: baseUrl.value || provider.value?.baseUrl || ''
    }));

    return {
        // State (Refs)
        providerId,
        apiKey,
        model,
        baseUrl,
        models,
        testStatus,
        testResult,
        isFetchingModels,
        fetchModelError,

        // Computed
        provider,
        providers: allProviders,
        isValid,
        config: currentConfig,

        // Actions
        runTest,
        save,
        clear,
    };
}
