<script setup lang="ts">
import { ref, computed } from 'vue';
import { I18N, type Language, type Provider } from '@ai-selector/core';

interface Props {
  provider: Provider | null;
  baseUrl: string;
  disabled?: boolean;
  language?: Language;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  language: 'zh',
});

const emit = defineEmits<{
  'update:baseUrl': [value: string];
}>();

const isOpen = ref(false);
const t = computed(() => I18N[props.language]);
</script>

<template>
  <template v-if="provider">
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1 transition-colors"
    >
      <svg 
        :class="['w-3 h-3 transition-transform', isOpen && 'rotate-90']" 
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
      :style="{ gridTemplateRows: isOpen ? '1fr' : '0fr' }"
    >
      <div class="overflow-hidden">
        <input
          type="text"
          :value="baseUrl"
          @input="emit('update:baseUrl', ($event.target as HTMLInputElement).value)"
          :placeholder="provider.baseUrl"
          :disabled="disabled"
          class="apmsu-input apmsu-input-default"
        />
      </div>
    </div>
  </template>
</template>
