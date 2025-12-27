import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@ai-selector/core': path.resolve(__dirname, '../core/src'),
            '@ai-selector/react': path.resolve(__dirname, './src'),
        }
    }
})
