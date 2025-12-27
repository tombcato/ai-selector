<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAIConfig } from './useAIConfig';
import { I18N, type Language, type AIConfig, type ProviderConfig, type TestConnectionResult } from '@ai-selector/core';

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
} = useAIConfig({
  proxyUrl: props.proxyUrl,
  providerConfig: props.config,
  initialConfig: props.initialConfig,
  onSerialize: props.onSerialize,
  onDeserialize: props.onDeserialize,
});

const t = computed(() => I18N[props.language]);

const providerOpen = ref(false);
const modelOpen = ref(false);
const modelSearch = ref('');
const saveStatus = ref<'idle' | 'saved'>('idle');
const showBaseUrl = ref(false);

const providerRef = ref<HTMLDivElement | null>(null);
const modelRef = ref<HTMLDivElement | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Click outside handler
function handleClickOutside(e: MouseEvent) {
  if (providerRef.value && !providerRef.value.contains(e.target as Node)) {
    providerOpen.value = false;
  }
  if (modelRef.value && !modelRef.value.contains(e.target as Node)) {
    modelOpen.value = false;
    modelSearch.value = '';
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  if (debounceTimer) clearTimeout(debounceTimer);
});

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

// Auto-test on API key change
watch(apiKey, (newKey) => {
  if (!provider.value || provider.value.authType === 'none' || !newKey || newKey.length < 3) return;
  
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runTest();
  }, 1000);
});

// Filtered models
const filteredModels = computed(() =>
  models.value.filter(m =>
    m.name.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
    m.id.toLowerCase().includes(modelSearch.value.toLowerCase())
  )
);

// Get input class
const inputClass = computed(() => {
  if (testStatus.value === 'success') return 'apmsu-input apmsu-input-success';
  if (testStatus.value === 'error') return 'apmsu-input apmsu-input-error';
  return 'apmsu-input apmsu-input-default';
});

// Handle save
function handleSave() {
  save();
  saveStatus.value = 'saved';
  emit('save', currentConfig.value);
  setTimeout(() => { saveStatus.value = 'idle'; }, 2000);
}

// Handle provider select
function selectProvider(id: string) {
  providerId.value = id;
  providerOpen.value = false;
}

// Handle model select
function selectModel(id: string) {
  model.value = id;
  modelOpen.value = false;
  modelSearch.value = '';
}
</script>

<template>
  <div class="apmsu-card">
    <h2 v-if="title" class="text-lg font-semibold mb-4">{{ title }}</h2>

    <div class="space-y-3">
      <!-- Provider Selector -->
      <div class="space-y-2" ref="providerRef">
        <label class="apmsu-label">Provider</label>
        <div class="relative">
          <button
            type="button"
            @click="!disabled && (providerOpen = !providerOpen)"
            :disabled="disabled"
            class="apmsu-select-trigger"
          >
            <span v-if="provider" class="flex items-center gap-2 min-w-0">
              <img :src="provider.icon" :alt="provider.name" class="apmsu-provider-icon" />
              <span class="truncate">{{ provider.name }}</span>
            </span>
            <span v-else class="text-gray-500 dark:text-zinc-500">{{ t.selectProvider }}</span>
            <svg class="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>

          <div v-if="providerOpen" class="apmsu-dropdown max-h-[300px] overflow-auto p-1">
            <button
              v-for="p in providers"
              :key="p.id"
              type="button"
              @click="selectProvider(p.id)"
              :class="['apmsu-dropdown-item rounded-sm', providerId === p.id && 'apmsu-dropdown-item-active']"
            >
              <div class="flex items-center gap-2 flex-shrink-0">
                <img :src="p.icon" :alt="p.name" class="apmsu-provider-icon" />
                <span class="font-medium whitespace-nowrap">{{ p.name }}</span>
              </div>
              <span class="apmsu-hint-text ml-auto text-right truncate flex-1 min-w-0">
                {{ p.baseUrl.replace('https://', '') }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Base URL 折叠 -->
      <template v-if="provider">
        <button
          type="button"
          @click="showBaseUrl = !showBaseUrl"
          class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
        >
          <svg 
            :class="['w-3 h-3 transition-transform', showBaseUrl && 'rotate-90']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          {{ t.customBaseUrl }}
        </button>

        <div
          class="grid transition-all duration-200 ease-out"
          :style="{ gridTemplateRows: showBaseUrl ? '1fr' : '0fr' }"
        >
          <div class="overflow-hidden">
            <input
              type="text"
              v-model="baseUrl"
              :placeholder="provider.baseUrl"
              :disabled="disabled"
              class="apmsu-input apmsu-input-default"
            />
          </div>
        </div>
      </template>

      <!-- Auth & Model Collapsible Section -->
      <div :class="['transition-all duration-500 ease-in-out', providerId ? 'max-h-[1000px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden']">
        <div class="space-y-4">
          <!-- API Key Input -->
          <div v-if="provider && provider.authType !== 'none'" class="space-y-2">
            <label class="apmsu-label">API Key</label>
            <div class="relative">
              <input
                type="password"
                v-model="apiKey"
                :placeholder="t.apiKeyPlaceholder"
                :disabled="disabled"
                :class="[inputClass, 'pr-10']"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <svg v-if="testStatus === 'testing'" class="apmsu-icon-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg v-else-if="testStatus === 'success'" class="apmsu-icon-success" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <svg v-else-if="testStatus === 'error'" class="apmsu-icon-error" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <button
                    v-else-if="testStatus === 'idle' && apiKey"
                    type="button"
                    @click="runTest()"
                    class="p-1 -m-1 text-gray-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="点击测试连通性"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
              </span>
            </div>
            
            <!-- Error Message with Animation -->
            <div
                class="grid transition-all duration-200 ease-out"
                :style="{ gridTemplateRows: testStatus === 'error' && testResult?.message ? '1fr' : '0fr' }"
            >
                <div class="overflow-hidden">
                    <div class="pt-1 text-xs space-y-0.5">
                        <p class="text-red-500 dark:text-red-400 font-medium">{{ t.testFailed }}</p>
                        <p class="text-red-500/80 dark:text-red-400/80 line-clamp-2">{{ testResult?.message }}</p>
                    </div>
                </div>
            </div>
          </div>

          <!-- Model Selector -->
          <div class="space-y-2" ref="modelRef">
            <label class="apmsu-label">Model</label>
            <div class="relative">
              <button
                type="button"
                @click="!disabled && providerId && (modelOpen = !modelOpen)"
                :disabled="disabled || !providerId"
                class="apmsu-select-trigger"
              >
                <span v-if="model" class="truncate">
                  {{ models.find(m => m.id === model)?.name || model }}
                </span>
                <span v-else class="text-gray-500 dark:text-zinc-500">{{ t.selectModel }}</span>
                <svg class="w-4 h-4 opacity-50 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </button>

              <div v-if="modelOpen" class="apmsu-dropdown">
                <div class="p-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <input
                    type="text"
                    v-model="modelSearch"
                    :placeholder="t.searchModel"
                    class="apmsu-input apmsu-input-default"
                    autofocus
                  />
                </div>
                <div class="max-h-60 overflow-auto">
                  <button
                    v-if="modelSearch && !filteredModels.some(m => m.id === modelSearch)"
                    type="button"
                    @click="selectModel(modelSearch)"
                    class="apmsu-dropdown-item bg-blue-50 dark:bg-blue-900/20 border-b"
                  >
                    <span class="text-blue-500">{{ t.useCustom }}: {{ modelSearch }}</span>
                  </button>
                  <button
                    v-for="m in filteredModels"
                    :key="m.id"
                    type="button"
                    @click="selectModel(m.id)"
                    :class="['apmsu-dropdown-item', model === m.id && 'apmsu-dropdown-item-active']"
                  >
                    <span>{{ m.name }}</span>
                  </button>
                  <div v-if="filteredModels.length === 0 && !modelSearch" class="p-4 text-center apmsu-hint-text">
                    {{ t.noModels }}
                  </div>
                </div>
              </div>
            </div>
            <p v-if="!apiKey && provider?.authType !== 'none'" class="apmsu-hint-text">
              {{ t.apiKeyTip }}
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="pt-2">
        <button
          @click="handleSave"
          :disabled="!isValid || disabled"
          :class="['apmsu-btn w-full', saveStatus === 'saved' ? 'apmsu-btn-success' : 'apmsu-btn-primary']"
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
    </div>

    <!-- Config Preview -->
    <div v-if="showPreview && provider" class="mt-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-gray-200/50 dark:border-zinc-800">
      <h3 class="text-xs font-medium text-gray-500 dark:text-zinc-500 mb-2 uppercase tracking-wider">{{ t.preview }}</h3>
      <pre class="text-xs text-gray-600 dark:text-zinc-400 font-mono overflow-x-auto leading-relaxed">
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
</template>

<style>
/* 样式已在 main.ts 中通过 style.css 导入 */
</style>
