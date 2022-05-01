import type { Plugin, IndexHtmlTransformResult } from 'vite'
import type { Options, TransformOptions } from '../index'
import { transformChunk, transformAsset, transformLegacyHtml, transformHtml } from './core/transform'

export function dynamicBase(options?: Options): Plugin {
  const defaultOptions: Options = {
    publicPath: 'window.__dynamic_base__',
    transformIndexHtml: false // maybe default true
  }

  const { publicPath, transformIndexHtml } = { ...defaultOptions, ...(options || {}) }

  // const preloadHelperId = 'vite/preload-helper'
  let assetsDir = 'assets'
  let base = '/'
  let legacy = false
  let baseOptions: TransformOptions = { assetsDir, base, legacy, publicPath, transformIndexHtml }

  return {
    name: 'vite-plugin-dynamic-base',
    enforce: 'post',
    apply: 'build',
    configResolved(resolvedConfig) {
      assetsDir = resolvedConfig.build.assetsDir
      base = resolvedConfig.base
      legacy = !!resolvedConfig?.define?.['import.meta.env.LEGACY']
      if (!base || base === '/') {
        throw new Error(
          'Please replace `config.base` in build with unique markup text, (e.g. /__dynamic_base__/)\n' +
            'Recommended changes:\n' +
            `  - base: ${JSON.stringify(base)},\n` +
            `  + base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",\n` +
            '  (in your vite.config.ts/js file)'
        )
      }
      Object.assign(baseOptions, { assetsDir, base, legacy })
    },
    async generateBundle({ format }, bundle) {
      if (format !== 'es' && format !== 'system') {
        return
      }
      await Promise.all(
        Object.entries(bundle).map(async ([, chunk]) => {
          if (chunk.type === 'chunk' && chunk.code.indexOf(base) > -1) {
            chunk.code = await transformChunk(format, chunk.code, baseOptions)
          } else if (chunk.type === 'asset' && typeof chunk.source === 'string') {
            if (!chunk.fileName.endsWith('.html')) {
              chunk.source = await transformAsset(chunk.source, baseOptions)
            } else if (legacy && transformIndexHtml) {
              chunk.source = await transformLegacyHtml(chunk.source, baseOptions)
            }
          }
        })
      )
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html): IndexHtmlTransformResult {
        if (!transformIndexHtml) {
          return html
        }
        return transformHtml(html, baseOptions)
      }
    }
  }
}
