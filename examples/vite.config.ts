import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dynamicPublicPath } from 'vite-plugin-dynamic-assets'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'a/b',
  plugins: [
    vue(),
    dynamicPublicPath()
  ],
  build: {
    // assetsDir: 'assets/a/b'
  }
})
