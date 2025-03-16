import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    strictExports: true,
    preserveSymlinks: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://13.125.170.208',
        changeOrigin: true,
      },
    },
  },
});
