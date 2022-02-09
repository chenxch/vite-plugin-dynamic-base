import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dynamicBase } from 'vite-plugin-dynamic-base'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'a/b',
  plugins: [
    vue(),
    dynamicBase()
  ],
  build: {
    // assetsDir: 'assets/a/b'
  }
})
