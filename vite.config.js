import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wordpress: resolve(__dirname, 'wordpress.html'),
        ai: resolve(__dirname, 'ai.html'),
        googleAds: resolve(__dirname, 'google-ads.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
