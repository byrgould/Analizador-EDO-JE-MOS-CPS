import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mos: resolve(__dirname, 'mos.html'),
        submos: resolve(__dirname, 'submos.html'),
        dalessandro: resolve(__dirname, 'dalessandro.html'),
        partch: resolve(__dirname, 'partch.html')
      }
    }
  }
});
