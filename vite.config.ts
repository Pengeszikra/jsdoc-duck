import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'jsdoc-duck',
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // ensure that external packages are not bundled
      external: ['react', 'use-saga-reducer', 'redux-saga'],
      output: {
        entryFileNames: 'jsdoc-duck.[format].js',
        globals: {
          react: 'React',
        }
      }
    },
  },
  plugins: [dts()],
});
