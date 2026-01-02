import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'AISelectorCore',
            fileName: (format) => format === 'umd' ? 'index.umd.js' : 'index.js',
            formats: ['es', 'umd']
        },
        sourcemap: true,
        emptyOutDir: true
    }
});
