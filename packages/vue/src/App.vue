<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import AIConfigForm from './AIConfigForm.vue';
import type { AIConfig, TestConnectionResult, ProviderConfig } from '@ai-selector/core';

// 示例配置
const providerConfig: ProviderConfig = {
  mode: 'default',
};

const isDark = ref(false);

onMounted(() => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
});

watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark);
}, { immediate: true });

function toggleTheme() {
  isDark.value = !isDark.value;
}

function handleSave(config: AIConfig) {
  console.log('配置已保存:', config);
  alert('配置已保存！');
}

function handleTestResult(result: TestConnectionResult) {
  console.log('测试结果:', result);
}

function handleChange(config: Partial<AIConfig>) {
  console.log('配置变化:', config);
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="max-w-2xl mx-auto p-8 space-y-8">
      <header class="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            Vue Adapter Demo
          </h1>
          <p class="text-sm text-gray-500 dark:text-zinc-500 mt-2">
            Powered by @ai-selector/vue + AIConfigForm 组件
          </p>
        </div>
        <button
          @click="toggleTheme"
          class="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <!-- Sun icon -->
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </header>

      <AIConfigForm 
        proxyUrl="http://localhost:8000"
        :config="providerConfig"
        title="AI 配置"
        showPreview
        saveButtonText="保存配置"
        @save="handleSave"
        @test-result="handleTestResult"
        @change="handleChange"
      />

      <div class="text-xs text-gray-400 dark:text-zinc-500 space-y-1">
        <p>✨ 一行代码即可集成完整的 AI 配置表单</p>
        <p>📦 支持通过 JSON 配置自定义 Providers</p>
        <p>🎨 使用共享样式系统，React/Vue 样式统一</p>
      </div>
    </div>
  </div>
</template>

<style>
/* 样式已在 main.ts 中通过 style.css 导入 */
</style>
