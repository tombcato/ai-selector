import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@ai-selector/core': path.resolve(__dirname, '../core/src'),
        }
    },
    server: {
        port: 5174 // 避免和 React (5173) 冲突
    }
})
