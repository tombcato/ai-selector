<script setup lang="ts">
import { Ticker as SmartTicker } from '@tombcato/smart-ticker/vue';
import '@tombcato/smart-ticker/style.css';

const props = defineProps<{
  text?: string;
  className?: string;
  placeholder?: string;
}>();
</script>

<template>
  <span v-if="!text && placeholder" :class="['apmsu-placeholder', className]">
    {{ placeholder }}
  </span>
  <span v-else-if="text" :class="['inline-flex min-w-0', className]">
    <SmartTicker :value="text" :char-width="0.8" :duration="300" />
  </span>
</template>
