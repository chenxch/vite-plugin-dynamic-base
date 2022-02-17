import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dynamicBase } from 'vite-plugin-dynamic-base'
// import { dynamicBase } from '../dist/index'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/__vite_base__/' : '/',
  plugins: [
    vue(),
    dynamicBase({ transformIndexHtml: true })
  ],
  build: {
    // assetsDir: 'assets/a/b'
  }
})
