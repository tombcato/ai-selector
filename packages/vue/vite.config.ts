import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AISelectorVue',
            fileName: (format) => format === 'umd' ? 'index.umd.js' : 'index.js',
            formats: ['es', 'umd'],
            cssFileName: 'index',
        },
        cssCodeSplit: false,
        rollupOptions: {
            external: [
                'vue',
                '@tombcato/ai-selector-core',
                '@tombcato/smart-ticker',
                '@tombcato/smart-ticker/vue'
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    '@tombcato/ai-selector-core': 'AISelectorCore'
                }
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
});
