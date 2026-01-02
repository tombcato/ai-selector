<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { I18N, type Language, type Provider } from '@tombcato/ai-selector-core';
import SmartText from './SmartText.vue';

interface Props {
  providers: Provider[];
  selectedProviderId: string;
  disabled?: boolean;
  language?: Language;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  language: 'zh',
});

const emit = defineEmits<{
  select: [providerId: string];
}>();

const isOpen = ref(false);
const triggerRef = ref<HTMLDivElement | null>(null);
const t = computed(() => I18N[props.language]);
const selectedProvider = computed(() => props.providers.find(p => p.id === props.selectedProviderId));

function handleClickOutside(e: MouseEvent) {
  if (triggerRef.value && !triggerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

function handleSelect(id: string) {
  emit('select', id);
  isOpen.value = false;
}
</script>

<template>
  <div class="apmsu-field" ref="triggerRef">
    <label class="apmsu-label">{{ t.providerLabel }}</label>
    <div class="relative">
      <button
        type="button"
        @click="!disabled && (isOpen = !isOpen)"
        :disabled="disabled"
        class="apmsu-select-trigger"
      >
        <div v-if="selectedProvider" class="flex items-center gap-2 min-w-0">
          <img :src="selectedProvider.icon" :alt="selectedProvider.name" class="apmsu-provider-icon" />
          <SmartText :text="selectedProvider.name" />
        </div>
        <span v-else class="apmsu-placeholder">{{ t.selectProvider }}</span>
        <svg 
          :class="['apmsu-chevron', isOpen ? 'rotate-180' : '']" 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div :class="['apmsu-dropdown max-h-[300px] overflow-auto p-1 origin-top', isOpen ? 'apmsu-dropdown-open' : '']">
        <button
          v-for="p in providers"
          :key="p.id"
          type="button"
          @click="handleSelect(p.id)"
          :class="['apmsu-dropdown-item rounded-sm', selectedProviderId === p.id && 'apmsu-dropdown-item-active']"
        >
          <div class="flex items-center gap-2 flex-shrink-0">
            <img :src="p.icon" :alt="p.name" class="apmsu-provider-icon" />
            <span class="font-medium whitespace-nowrap">{{ p.name }}</span>
          </div>
          <span class="apmsu-hint-text ml-auto text-right truncate flex-1 min-w-0 apmsu-provider-baseurl">
            {{ p.baseUrl.replace('https://', '') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
