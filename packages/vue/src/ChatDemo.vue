<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useAIConfig } from './useAIConfig';
import { sendDirectChat } from '@tombcato/ai-selector-core';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const props = defineProps<{
  proxyUrl?: string; // 现在是可选的
}>();

const aiConfig = useAIConfig({ proxyUrl: props.proxyUrl });
const messages = ref<Message[]>([]);
const inputText = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);

const canSend = computed(() => 
  aiConfig.isValid.value && inputText.value.trim() && !isLoading.value
);

async function sendMessage() {
  if (!canSend.value) return;

  const userMessage = inputText.value.trim();
  inputText.value = '';
  error.value = null;

  messages.value.push({ role: 'user', content: userMessage });
  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  try {
    let assistantContent = '';

    if (props.proxyUrl) {
      // 有代理地址时，走后端
      const response = await fetch(`${props.proxyUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: aiConfig.providerId.value,
          api_key: aiConfig.apiKey.value,
          model: aiConfig.model.value,
          base_url: aiConfig.config.value.baseUrl,
          api_format: aiConfig.provider.value?.apiFormat || 'openai',
          messages: messages.value.map(m => ({ role: m.role, content: m.content })),
          max_tokens: 2048,
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        assistantContent = data.content;
      } else {
        error.value = data.message || '请求失败';
      }
    } else {
      // 无代理地址时，纯前端直连
      const result = await sendDirectChat({
        apiFormat: aiConfig.provider.value?.apiFormat || 'openai',
        baseUrl: aiConfig.config.value.baseUrl || aiConfig.provider.value?.baseUrl || '',
        apiKey: aiConfig.apiKey.value,
        model: aiConfig.model.value,
        messages: messages.value.map(m => ({ role: m.role, content: m.content })),
        maxTokens: 2048,
      });

      if (result.success && result.content) {
        assistantContent = result.content;
      } else {
        error.value = result.message || '请求失败';
      }
    }

    if (assistantContent) {
      messages.value.push({ role: 'assistant', content: assistantContent });
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '网络错误';
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function clearChat() {
  messages.value = [];
  error.value = null;
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}
</script>

<template>
  <div class="border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
      <h2 class="font-semibold text-sm">💬 对话测试</h2>
      <div class="flex items-center gap-2">
        <span v-if="aiConfig.isValid.value" class="text-xs text-green-600 dark:text-green-400">
          ✓ {{ aiConfig.provider.value?.name }} / {{ aiConfig.model.value }}
        </span>
        <span v-else class="text-xs text-gray-400">请先完成上方配置</span>
        <button
          v-if="messages.length > 0"
          @click="clearChat"
          class="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          清空
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div 
      ref="messagesContainer"
      class="chat-messages h-80 overflow-y-auto p-4 space-y-4 bg-white dark:bg-zinc-950"
    >
      <div v-if="messages.length === 0" class="h-full flex items-center justify-center text-gray-400 dark:text-zinc-600 text-sm">
        {{ aiConfig.isValid.value ? '输入消息开始对话...' : '请先在上方配置 Provider 和 Model' }}
      </div>
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']"
      >
        <div
          :class="[
            'max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap',
            msg.role === 'user'
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
          ]"
        >
          {{ msg.content }}
        </div>
      </div>
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-gray-100 dark:bg-zinc-800 px-4 py-2 rounded-2xl rounded-bl-md">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>
      <!-- Error -->
      <div v-if="error" class="text-center text-red-500 text-sm">
        {{ error }}
      </div>
    </div>

    <!-- Input -->
    <div class="flex gap-2 p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
      <textarea
        v-model="inputText"
        @keydown="handleKeyDown"
        :placeholder="aiConfig.isValid.value ? '输入消息... (Enter 发送)' : '请先完成配置'"
        :disabled="!aiConfig.isValid.value || isLoading"
        rows="1"
        class="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        @click="sendMessage"
        :disabled="!canSend"
        class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-zinc-700 text-white rounded-xl transition-colors disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  </div>
</template>
