<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import AIConfigForm from './AIConfigForm.vue';
import ChatDemo from './ChatDemo.vue';
import type { AIConfig, TestConnectionResult, ProviderConfig } from '@tombcato/ai-selector-core';

// 常量
// 设为空字符串测试纯前端直连模式，设为 'http://localhost:8000' 走后端代理
const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';

// 示例配置
const providerConfig: ProviderConfig = {
  mode: 'default', // 可选值: 'default' | 'customOnly'

  // ========================================================================
  // 场景 1: 只显示指定的 Provider (白名单过滤)
  // ========================================================================
  // include: ['openai', 'anthropic'],
  // exclude: ['gemini'], // 或者使用黑名单

  // ========================================================================
  // 场景 2: 覆盖/添加自定义 Provider
  // ========================================================================
  // custom: {
  //   // 覆盖内置配置
  //   openai: {
  //     name: 'Enterprise OpenAI',
  //     baseUrl: 'https://gateway.company.com/openai/v1',
  //     apiFormat: 'openai',
  //     needsApiKey: true,
  //     models: [{ id: 'gpt-4o', name: 'GPT-4o' }]
  //   },
  //   // 添加新厂商
  //   deepseek: {
  //     name: 'DeepSeek',
  //     baseUrl: 'https://api.deepseek.com',
  //     apiFormat: 'openai',
  //     needsApiKey: true,
  //     icon: 'https://avatars.githubusercontent.com/u/148330874',
  //     models: [{ id: 'deepseek-chat', name: 'DeepSeek Chat' }]
  //   }
  // },

  // ========================================================================
  // 场景 3: 仅显示自定义 Provider
  // ========================================================================
  // mode: 'customOnly',
  // custom: {
  //   'my-private-model': {
  //     name: 'Internal AI',
  //     baseUrl: 'http://localhost:8080/v1',
  //     apiFormat: 'openai',
  //     needsApiKey: false,
  //     icon: 'https://placehold.co/32x32?text=INT',
  //     models: [
  //       { id: 'llama-3-8b', name: 'Llama 3 8B' },
  //       { id: 'mistral-7b', name: 'Mistral 7B' }
  //     ]
  //   }
  // }
};

// 主题
const isDark = ref(false);

onMounted(() => {
  isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
});

watch(isDark, (dark) => {
  document.documentElement.classList.toggle('dark', dark);
}, { immediate: true });

// 语言
const lang = ref<'zh' | 'en'>('zh');

function toggleLang() {
  lang.value = lang.value === 'zh' ? 'en' : 'zh';
}

function toggleTheme() {
  isDark.value = !isDark.value;
}

// 配置版本 (用于刷新 ChatDemo)
const configVersion = ref(0);

function handleSave(config: AIConfig) {
  console.log('配置已保存:', config);
  configVersion.value++;
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
    <div class="max-w-xl mx-auto p-8 space-y-8">
      <header class="flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 pb-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
            Vue Adapter Demo
          </h1>
          <p class="text-sm text-gray-500 dark:text-zinc-500 mt-2">
            Powered by @tombcato/ai-selector-vue + AIConfigForm 组件
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="toggleLang"
            class="px-3 py-1.5 text-sm font-medium rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            {{ lang === 'zh' ? 'English' : '中文' }}
          </button>
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
        </div>
      </header>

      <!-- 连接模式显示 -->
      <div class="px-3 py-2 text-xs rounded-md flex items-center gap-1" :class="PROXY_URL ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800'">
        <span>{{ PROXY_URL ? '🛡️ 后端代理模式' : '🔗 前端直连模式（注意：部分Provider不支持直连跨域）' }}</span>
        <span v-if="PROXY_URL" class="opacity-60 truncate">{{ PROXY_URL }}</span>
      </div>

      <AIConfigForm 
        :language="lang" 
        :proxyUrl="PROXY_URL"
        :config="providerConfig"
        title="AI 配置"
        showPreview
        @save="handleSave"
        @test-result="handleTestResult"
        @change="handleChange"
      />

      <div class="text-xs text-gray-400 dark:text-zinc-500 space-y-1">
        <p>✨ 一行代码即可集成完整的 AI 配置表单</p>
        <p>📦 支持通过 JSON 配置自定义 Providers</p>
        <p>🎨 使用共享样式系统，React/Vue 样式统一</p>
      </div>

      <!-- 对话测试区域 - key 强制刷新 -->
      <ChatDemo :key="configVersion" :proxyUrl="PROXY_URL" />
    </div>
  </div>
</template>

<style>
/* 样式已在 main.ts 中通过 style.css 导入 */
</style>
