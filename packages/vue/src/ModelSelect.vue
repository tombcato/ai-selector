<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { I18N, type Language, type Provider, type Model } from '@tombcato/ai-selector-core';
import SmartText from './SmartText.vue';

interface Props {
  provider: Provider | null;
  models: Model[];
  selectedModelId: string;
  hasApiKey: boolean;
  disabled?: boolean;
  language?: Language;
  isFetchingModels?: boolean;
  fetchModelError?: string | null;
  selectedModelName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  language: 'zh',
});

const emit = defineEmits<{
  select: [modelId: string, modelName?: string];
}>();

const isOpen = ref(false);
const modelSearch = ref('');
const triggerRef = ref<HTMLDivElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const t = computed(() => I18N[props.language]);

// Auto focus search input when opened
watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    // Small delay to ensure transition doesn't interfere with focus
    setTimeout(() => {
      searchInputRef.value?.focus();
    }, 200);
  }
});

const filteredModels = computed(() =>
  props.models.filter(m =>
    m.name.toLowerCase().includes(modelSearch.value.toLowerCase()) ||
    m.id.toLowerCase().includes(modelSearch.value.toLowerCase())
  )
);

const activeModelName = computed(() => 
  props.models.find(m => m.id === props.selectedModelId)?.name || props.selectedModelName || props.selectedModelId
);

function handleClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
    modelSearch.value = '';
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

function handleSelect(id: string, name?: string) {
  emit('select', id, name);
  isOpen.value = false;
  modelSearch.value = '';
}
</script>

<template>
  <div class="apmsu-field" ref="triggerRef">
    <label class="apmsu-label flex items-center justify-between">
      <span>{{ t.modelLabel }}</span>
    </label>
    <div class="relative">
      <button
        type="button"
        @click="!disabled && provider && (isOpen = !isOpen)"
        :disabled="disabled || !provider"
        class="apmsu-select-trigger"
      >
        <SmartText 
          :text="activeModelName ? activeModelName : ''"
          :placeholder="t.selectModel"
        />
        <svg 
          :class="['apmsu-chevron', isOpen ? 'rotate-180' : '']" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div :class="['apmsu-dropdown origin-top', isOpen ? 'apmsu-dropdown-open' : '']">
        <div class="p-1.5 border-b border-gray-100 dark:border-zinc-800">
          <input
            ref="searchInputRef"
            type="text"
            v-model="modelSearch"
            :placeholder="t.searchModel"
            class="apmsu-select-trigger"
          />
        </div>
        <div class="max-h-60 overflow-auto">
          <button
            v-if="modelSearch && !filteredModels.some(m => m.id === modelSearch)"
            type="button"
            @click="handleSelect(modelSearch)"
            class="apmsu-dropdown-item bg-blue-50 dark:bg-blue-900/20 border-b"
          >
            <span class="text-blue-500">{{ t.useCustom }}: {{ modelSearch }}</span>
          </button>
          <button
            v-for="m in filteredModels"
            :key="m.id"
            type="button"
            @click="handleSelect(m.id, m.name)"
            :class="['apmsu-dropdown-item', selectedModelId === m.id && 'apmsu-dropdown-item-active']"
          >
            <span>{{ m.name }}</span>
          </button>
          <div v-if="filteredModels.length === 0 && !modelSearch" class="p-4 text-center apmsu-hint-text">
            {{ t.noModels }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status Messages Container - only for supportsModelsApi providers -->
    <div v-if="provider?.supportsModelsApi" class="min-h-[20px] flex items-center">
      <p v-if="isFetchingModels" class="apmsu-hint-text animate-pulse">
        {{ t.refreshingModels }}
      </p>
      
      <p v-else-if="fetchModelError" class="apmsu-hint-text dark:text-zinc-500">
        {{ (t as any)[fetchModelError] || fetchModelError }}
      </p>

      <p v-else-if="provider?.needsApiKey && !hasApiKey" class="apmsu-hint-text">
        {{ t.apiKeyTip }}
      </p>

      <p v-else class="apmsu-hint-text">
        {{ t.modelListUpdated }}
      </p>
    </div>
  </div>
</template>
