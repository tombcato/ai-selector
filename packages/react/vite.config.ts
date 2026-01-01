import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AISelectorReact',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@ai-selector/core', '@tombcato/smart-ticker'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    '@ai-selector/core': 'AISelectorCore'
                }
            }
        },
        sourcemap: true,
        emptyOutDir: true
    }
});
