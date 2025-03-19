import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'out',
    lib: {
      entry: {
        example: 'src/example/index.ts',
        search: 'src/search/index.ts',
      },
      formats: ['cjs'],
      name: '[name]'
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name]/index.js',
        format: 'cjs',
        exports: 'default',
        extend: true,
      }
    }
  }
});
