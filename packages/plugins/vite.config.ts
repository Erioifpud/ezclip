import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'out',
    lib: {
      entry: {
        example: 'src/example/index.ts'
      },
      formats: ['umd'],
      name: 'EzclipPlugin'
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name]/index.js',
        format: 'umd',
        exports: 'named'
      }
    }
  }
});
