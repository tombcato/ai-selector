import { ref, computed, watch, onMounted } from 'vue';
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
    proxyUrl?: string;
    initialConfig?: Partial<AIConfig>;
    providerConfig?: ProviderConfig;
}

export function useAIConfig(options: UseAIConfigOptions = {}) {
    const providerId = ref(options.initialConfig?.providerId || '');
    const apiKey = ref(options.initialConfig?.apiKey || '');
    const model = ref(options.initialConfig?.model || '');
    const baseUrl = ref(options.initialConfig?.baseUrl || '');

    const models = ref<Model[]>([]);
    const testStatus = ref<'idle' | 'testing' | 'success' | 'error'>('idle');
    const testResult = ref<TestConnectionResult | null>(null);

    // Resolve provider config
    const resolvedConfig = computed(() => resolveProviderConfig(options.providerConfig));
    const allProviders = computed(() => resolvedConfig.value.providers);

    const provider = computed(() =>
        allProviders.value.find(p => p.id === providerId.value) || null
    );

    const storage = createConfigStorage();

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

    // Watch for provider/auth changes to fetch models
    watch(
        [provider, apiKey, baseUrl],
        async ([newProvider, newApiKey, newBaseUrl]) => {
            if (!newProvider) {
                models.value = [];
                return;
            }

            // Get custom models from config
            const customModels = resolvedConfig.value.getModels(newProvider.id);

            if (newProvider.authType !== 'none' && !newApiKey) {
                models.value = customModels;
                return;
            }

            // If custom models and no API support, use them
            if (customModels.length > 0 && !newProvider.supportsModelsApi) {
                models.value = customModels;
                return;
            }

            try {
                const fetched = await fetchModels({
                    provider: newProvider,
                    apiKey: newApiKey,
                    baseUrl: newBaseUrl,
                    proxyUrl: options.proxyUrl
                });
                models.value = fetched.length > 0 ? fetched : customModels;
            } catch {
                models.value = customModels;
            }
        },
        { immediate: true }
    );

    // Actions
    async function runTest() {
        if (!provider.value) return;
        if (provider.value.authType !== 'none' && !apiKey.value) return;

        testStatus.value = 'testing';
        testResult.value = null;

        const result = await testConnection({
            provider: provider.value,
            apiKey: apiKey.value,
            baseUrl: baseUrl.value,
            model: model.value,
            proxyUrl: options.proxyUrl
        });

        testStatus.value = result.success ? 'success' : 'error';
        testResult.value = result;
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
        if (provider.value?.authType !== 'none' && !apiKey.value) return false;
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
