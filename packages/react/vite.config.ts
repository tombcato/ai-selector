import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AISelectorReact',
            fileName: (format) => format === 'umd' ? 'index.umd.js' : 'index.js',
            formats: ['es', 'umd'],
            cssFileName: 'index',
        },
        cssCodeSplit: false,
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                '@tombcato/ai-selector-core',
                '@tombcato/smart-ticker',
                '@tombcato/smart-ticker/react'
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@tombcato/ai-selector-core': 'AISelectorCore'
                }
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
});
