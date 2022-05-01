import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { dynamicBase } from 'vite-plugin-dynamic-base'
import { dynamicBase } from '../dist/index'
import legacy from '@vitejs/plugin-legacy'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'a/b',
  base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
  plugins: [
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    vue(),
    VitePWA({}),
    dynamicBase({ transformIndexHtml: true }),
  ],
  build: {
    // assetsDir: 'assets/a/b'
  }
})
