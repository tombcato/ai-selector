<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAIConfig } from './useAIConfig';

import { I18N, type Language, type AIConfig, type ProviderConfig, type TestConnectionResult, type ModelFetcher } from '@ai-selector/core';

// Sub-components
import ProviderSelect from './ProviderSelect.vue';
import AuthInput from './AuthInput.vue';
import ModelSelect from './ModelSelect.vue';
import BaseUrlInput from './BaseUrlInput.vue';

interface Props {
  proxyUrl: string;
  config?: ProviderConfig;
  initialConfig?: Partial<AIConfig>;
  title?: string;
  showPreview?: boolean;
  saveButtonText?: string;
  disabled?: boolean;
  onSerialize?: (data: any) => string;
  onDeserialize?: (data: string) => any;
  language?: Language;
  modelFetcher?: ModelFetcher;
}

const props = withDefaults(defineProps<Props>(), {
  showPreview: false,
  disabled: false,
  language: 'zh',
});

const emit = defineEmits<{
  save: [config: AIConfig];
  testResult: [result: TestConnectionResult];
  change: [config: Partial<AIConfig>];
}>();

const {
  providerId,
  apiKey,
  model,
  modelName,
  baseUrl,
  models,
  testStatus,
  testResult,
  provider,
  providers,
  isValid,
  config: currentConfig,
  runTest,
  save,
  isFetchingModels,
  fetchModelError,
} = useAIConfig({
  proxyUrl: props.proxyUrl,
  providerConfig: props.config,
  initialConfig: props.initialConfig,
  onSerialize: props.onSerialize,
  onDeserialize: props.onDeserialize,
  modelFetcher: props.modelFetcher,
});

const t = computed(() => I18N[props.language]);
const saveStatus = ref<'idle' | 'saved'>('idle');
const isPreviewOpen = ref(false);

// Watch for changes
watch([providerId, apiKey, model, baseUrl], () => {
  emit('change', {
    providerId: providerId.value,
    apiKey: apiKey.value,
    model: model.value,
    baseUrl: baseUrl.value,
  });
});

// Watch test result
watch(testResult, (result) => {
  if (result) emit('testResult', result);
});

// Handle save
function handleSave() {
  save();
  saveStatus.value = 'saved';
  emit('save', currentConfig.value);
  setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
}

// Handler wrappers for vue events
function updateProvider(id: string) {
  providerId.value = id;
}

function updateApiKey(val: string) {
  apiKey.value = val;
}

function updateModel(id: string) {
  model.value = id;
}

function updateBaseUrl(val: string) {
  baseUrl.value = val;
}

</script>

<template>
  <div class="apmsu-card">
    <h2 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h2>

    <div class="space-y-3">
      <ProviderSelect
        :providers="providers"
        :selectedProviderId="providerId"
        @select="updateProvider"
        :disabled="disabled"
        :language="language"
      />

      <BaseUrlInput
        :provider="provider"
        :baseUrl="baseUrl"
        @update:baseUrl="updateBaseUrl"
        :disabled="disabled"
        :language="language"
      />

      <!-- Auth & Model Collapsible Section -->
      <div :class="['transition-all duration-500 ease-in-out', providerId ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden']">
        <div class="space-y-4">
          <AuthInput
            :provider="provider"
            :apiKey="apiKey"
            @update:apiKey="updateApiKey"
            :testStatus="testStatus"
            :disabled="disabled"
            :language="language"
            :isFetchingModels="isFetchingModels"
            :fetchModelError="fetchModelError"
          />

          <ModelSelect
            :provider="provider"
            :models="models"
            :selectedModelId="model"
            @select="updateModel"
            :hasApiKey="!!apiKey"
            :disabled="disabled"
            :language="language"
            :isFetchingModels="isFetchingModels"
            :fetchModelError="fetchModelError"
            :selectedModelName="modelName"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 space-y-2">
        <div class="flex gap-2">
          <button
            type="button"
            @click="runTest()"
            :disabled="!providerId || !apiKey || !model || disabled || testStatus === 'testing'"
            :class="['apmsu-btn flex-1', 
              testStatus === 'success' ? 'apmsu-btn-success' : 
              testStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40' : 
              'apmsu-btn-ghost border border-gray-200 dark:border-zinc-700'
            ]"
          >
            <span v-if="testStatus === 'testing'" class="flex items-center justify-center gap-2">
              <svg class="apmsu-icon-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ t.testing }}
            </span>
            <span v-else-if="testStatus === 'success'" class="flex items-center justify-center gap-2">
              <svg class="apmsu-icon-success" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              {{ t.testSuccess }} {{ testResult?.latencyMs ? `${testResult.latencyMs}ms` : '' }}
            </span>
            <span v-else-if="testStatus === 'error'" class="flex items-center justify-center gap-2">
              <svg class="apmsu-icon-error" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              {{ t.testFailed }}
            </span>
            <template v-else>{{ t.testConnection }}</template>
          </button>

          <button
            @click="handleSave"
            :disabled="!isValid || disabled"
            :class="['apmsu-btn flex-1', saveStatus === 'saved' ? 'apmsu-btn-success' : 'apmsu-btn-primary']"
          >
            <span v-if="saveStatus === 'saved'" class="flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {{ t.saved }}
            </span>
            <template v-else>{{ saveButtonText || t.save }}</template>
          </button>
        </div>

        <!-- Error Message -->
        <div
          class="grid transition-all duration-200 ease-out"
          :style="{ gridTemplateRows: (!testResult?.success && testResult?.message && testStatus !== 'testing' && testStatus !== 'success') ? '1fr' : '0fr' }"
        >
          <div class="overflow-hidden">
            <div class="p-2 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-xs text-red-600 dark:text-red-400 line-clamp-3 text-left">{{ testResult?.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Config Preview - Collapsible -->
    <div v-if="showPreview && provider" class="mt-6 border border-gray-200/50 dark:border-zinc-800 rounded-lg overflow-hidden">
      <button
        type="button"
        @click="isPreviewOpen = !isPreviewOpen"
        class="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <h3 class="text-xs font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wider">{{ t.preview }}</h3>
        <svg 
          :class="['w-4 h-4 text-gray-400 transition-transform duration-200', isPreviewOpen ? 'rotate-180' : '']"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div 
        class="grid transition-all duration-200 ease-out"
        :style="{ gridTemplateRows: isPreviewOpen ? '1fr' : '0fr' }"
      >
        <div class="overflow-hidden">
          <pre class="text-xs text-gray-600 dark:text-zinc-400 font-mono overflow-x-auto leading-relaxed p-4 bg-zinc-50 dark:bg-zinc-900/50">
{{ JSON.stringify({
  provider: provider.name,
  apiFormat: provider.apiFormat,
  baseUrl: baseUrl || provider.baseUrl,
  model: model || t.unselected,
  hasApiKey: !!apiKey
}, null, 2) }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 样式已在 main.ts 中通过 style.css 导入 */
</style>
