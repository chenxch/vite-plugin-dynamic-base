import type { Plugin } from 'vite'
import type { Options } from '../index'

export function dynamicBase(options?: Options): Plugin {
  const { publicPath = 'window.__dynamic_base__' } = options || {}
  const preloadHelperId = 'vite/preload-helper'
  let assetsDir = 'assets'
  let base = '/'

  return {
    name: 'vite-plugin-dynamic-base',
    enforce: 'post',
    apply: 'build',
    configResolved(configResolved) {
      assetsDir = configResolved.build.assetsDir
      base = configResolved.base
    },
    transform(code, id) {
      if (id === preloadHelperId) {
        code = code.replace(/(\${base})/g, `\${${publicPath}}$1`)
        return {
          code
        }
      }
    },
    generateBundle({ format }, bundle) {
      if (format !== 'es') {
        return
      }
      const assetsMarker = `${base}${assetsDir}/`
      const assetsMarkerRE = new RegExp(`("${assetsMarker}*.*.*")`, 'g')
      for (const file in bundle) {
        const chunk = bundle[file]
        if (chunk.type === 'chunk' && chunk.code.indexOf(assetsMarker) > -1) {
          chunk.code = chunk.code.replace(assetsMarkerRE, `${publicPath}+$1`)
        }
      }
    }
  }
}
