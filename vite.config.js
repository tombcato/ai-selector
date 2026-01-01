import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                // 保留 SVG 原有颜色
                icon: true,
            },
        }),
    ],
    resolve: {
        alias: {
            '@tombcato/ai-selector-core': '/packages/core/src',
            '@tombcato/ai-selector-react': '/packages/react/src',
            '@tombcato/ai-selector-vue': '/packages/vue/src',
        },
    },
})
