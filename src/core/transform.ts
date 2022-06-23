import type { TransformOptions } from '../../index'
import { parse } from 'node-html-parser'
import { replaceQuotes, replaceUrl, replace, replaceSrc, replaceImport } from './utils'

export function transformChunk(format: 'system' | 'es', code: string, options: TransformOptions) {
  const { base, publicPath } = options
  let content = replaceQuotes(base, publicPath, code)
  if (format === 'system') {
    // replace css url
    content = replaceUrl(base, publicPath, content)
  }
  return content
}

export function transformAsset(code: string, options: TransformOptions) {
  const { assetsDir, base } = options
  let content = replace(`${base}${assetsDir}/`, '', code)
  content = replace(base, '', content)
  return content
}

export function transformLegacyHtml(code: string, options: TransformOptions) {
  const { base, publicPath } = options
  let content = replaceSrc(publicPath, code)
  content = replace(base, '/', content)
  content = replaceImport(publicPath, content)
  const document = parse(content, { comment: true })
  const legacyPolyfill = document.getElementById('vite-legacy-polyfill')
  if (legacyPolyfill) {
    legacyPolyfill.setAttribute('data-src', legacyPolyfill.getAttribute('src'))
    legacyPolyfill.removeAttribute('src')
    legacyPolyfill.innerHTML = `!(function() {
      var e = document.createElement('script')
      e.src = ${publicPath} + document.getElementById('vite-legacy-polyfill').getAttribute('data-src');
      e.onload = function() {
        System.import(${publicPath}+document.getElementById('vite-legacy-entry').getAttribute('data-src'))
      };
      document.body.appendChild(e)
    })();`
  }
  const legacyEntry = document.getElementById('vite-legacy-entry')
  if (legacyEntry) {
    legacyEntry.innerHTML = ''
  }
  content = document.outerHTML
  return content
}

export function transformHtml(html: string, options: TransformOptions) {
  const { base, publicPath } = options
  const document = parse(html, { comment: true })
  const baseMarker = `${base}`
  const assetsTags = document.querySelectorAll(`head>link[href^="${baseMarker}"],head>script[src^="${baseMarker}"]`)
  const preloads = assetsTags.map(o => {
    const result = {
      parentTagName: o.parentNode.rawTagName,
      tagName: o.rawTagName,
      attrs: Object.assign(
        {},
        o.attrs,
        o.attrs.src ? { src: o.attrs.src.replace(baseMarker, '/') } : { href: o.attrs.href.replace(baseMarker, '/') }
      )
    }
    o.parentNode.removeChild(o)
    return result
  })
  const injectCode = `  <script>
(function(){
var preloads = ${JSON.stringify(preloads)};
function setAttribute(target, attrs) {
for (var key in attrs) {
  target.setAttribute(key, attrs[key]);
}
return target;
};
for(var i = 0; i < preloads.length; i++){
var item = preloads[i]
var childNode = document.createElement(item.tagName);
setAttribute(childNode, item.attrs)
if(${publicPath}) {
  if(item.tagName == 'link') {
    setAttribute(childNode, { href: ${publicPath} + item.attrs.href })
  } else if (item.tagName == 'script') {
    setAttribute(childNode, { src: ${publicPath} + item.attrs.src })
  }
}
document.getElementsByTagName(item.parentTagName)[0].appendChild(childNode);
}
})();
</script>
</head>`
  return document.outerHTML.replace('</head>', injectCode)
}
