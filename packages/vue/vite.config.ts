import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AISelectorVue',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['vue', '@ai-selector/core', '@tombcato/smart-ticker'],
            output: {
                globals: {
                    vue: 'Vue',
                    '@ai-selector/core': 'AISelectorCore'
                }
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
});
