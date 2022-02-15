import type { Plugin, IndexHtmlTransformResult } from 'vite'
import { parse } from 'node-html-parser'
import type { Options } from '../index'

export function dynamicBase(options?: Options): Plugin {
  const defaultOptions:Options ={
    publicPath: 'window.__dynamic_base__',
    transformIndexHtml: false // maybe dfault true
  } 
  
  const { 
    publicPath,
    transformIndexHtml
  } = {...defaultOptions ,...(options || {})}

  const preloadHelperId = 'vite/preload-helper'
  let assetsDir = 'assets'
  let base = '/'

  return {
    name: 'vite-plugin-dynamic-base',
    enforce: 'post',
    apply: 'build',
    configResolved(resolvedConfig) {
      assetsDir = resolvedConfig.build.assetsDir
      base = resolvedConfig.base
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
    },
    transformIndexHtml: {
      enforce: 'post',
      transform(html): IndexHtmlTransformResult {
        if(!transformIndexHtml) {
          return html
        }
        const document = parse(html, { comment: true })
        const assetsMarker = `${base}${assetsDir}/`
        const assetsTags = document.querySelectorAll(`link[href^="${assetsMarker}"],script[src^="${assetsMarker}"]`)
        const preloads = assetsTags.map(o => {
          const result = {
            parentTagName: o.parentNode.rawTagName,
            tagName: o.rawTagName,
            attrs: Object.assign({}, o.attrs)
          }
          o.parentNode.removeChild(o)
          return result
        })
        const injectCode = `  <script>
    var preloads = ${JSON.stringify(preloads)};
    function assign() {
      var target = arguments[0];
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    for(var i = 0; i < preloads.length; i++){
      var item = preloads[i]
      var childNode = document.createElement(item.tagName);
      assign(childNode, item.attrs)
      if(${publicPath}) {
        if(item.tagName == 'link') {
          assign(childNode, { href: ${publicPath} + item.attrs.href })
        } else if (item.tagName == 'script') {
          assign(childNode, { src: ${publicPath} + item.attrs.src })
        }
      }
      document.getElementsByTagName(item.parentTagName)[0].appendChild(childNode);
    }
  </script>
</head>`
        return document.outerHTML.replace('</head>', injectCode)
      }
    }
  }
}
