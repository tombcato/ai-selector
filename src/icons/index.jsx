// Provider Icons - 使用 Vite ?react 语法导入独立 SVG 文件
// 所有图标文件位于 src/icons/*.svg

import OpenAI from './openai.svg?react'
import Anthropic from './anthropic.svg?react'
import Gemini from './gemini.svg?react'
import DeepSeek from './deepseek.svg?react'
import Mistral from './mistral.svg?react'
import XAI from './xai.svg?react'
import Groq from './groq.svg?react'
import TogetherAI from './together_ai.svg?react'
import FireworksAI from './fireworks_ai.svg?react'
import DeepInfra from './deepinfra.svg?react'
import OpenRouter from './openrouter.svg?react'
import Perplexity from './perplexity.svg?react'
import Cohere from './cohere.svg?react'
import Moonshot from './moonshot.svg?react'
import Ollama from './ollama.svg?react'
import Qwen from './qwen.svg?react'
import Zhipu from './zhipu.svg?react'
import SiliconFlow from './siliconflow.svg?react'

// Provider ID 到 SVG 组件的映射
const iconMap = {
    openai: OpenAI,
    anthropic: Anthropic,
    gemini: Gemini,
    deepseek: DeepSeek,
    mistral: Mistral,
    xai: XAI,
    groq: Groq,
    together_ai: TogetherAI,
    fireworks_ai: FireworksAI,
    deepinfra: DeepInfra,
    openrouter: OpenRouter,
    perplexity: Perplexity,
    cohere: Cohere,
    moonshot: Moonshot,
    ollama: Ollama,
    qwen: Qwen,
    zhipu: Zhipu,
    siliconflow: SiliconFlow,
}

export default function ProviderIcon({ id, className = "w-5 h-5" }) {
    const IconComponent = iconMap[id]

    if (!IconComponent) {
        return <span className={className}>🔹</span>
    }

    return <IconComponent className={className} />
}

export { iconMap }
