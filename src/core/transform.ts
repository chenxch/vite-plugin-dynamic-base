import type {TransformOptions, TransformIndexHtmlConfig} from '../types'
import {parse} from 'node-html-parser'
import {replace, replaceImport, replaceInStringLiteral, replaceInTemplateElement, replaceSrc} from './utils'
import {StringAsBytes, collectMatchingStrings, parseCode} from "./ast";

export async function transformChunk(codeStr: string, options: TransformOptions): Promise<string> {
  const { base, publicPath } = options
  const [spanOffset, ast] = await parseCode(codeStr);

  const strings = collectMatchingStrings(base, ast);

  if (strings.length === 0) {
    return codeStr;
  }

  const code = new StringAsBytes(codeStr);

  let lastIdx = 0;
  let transformedCode = "";

  for (const str of strings) {
    const prev = code.slice(lastIdx, str.span.start - spanOffset);

    let transformed: string;
    if (str.type === 'TemplateElement') {
      transformed = replaceInTemplateElement(str, base, publicPath);
    } else if (str.type === 'StringLiteral') {
      transformed = replaceInStringLiteral(str, base, publicPath);
    }

    lastIdx = str.span.end - spanOffset;
    transformedCode += prev + transformed;
  }
  transformedCode += code.slice(lastIdx);

  return transformedCode;
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

export function transformHtml(html: string, options: TransformOptions,transformIndexHtmlConfig: TransformIndexHtmlConfig) {
  const { base, publicPath } = options
  const { publicPath: htmlPublicPath, insertBodyAfter } = transformIndexHtmlConfig || {}
  const targetPath = htmlPublicPath || publicPath
  const document = parse(html, { comment: true })
  const baseMarker = `${base}`
  const assetsTags = document.querySelectorAll(`link[href^="${baseMarker}"],script[src^="${baseMarker}"]`)
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
  const endTag = insertBodyAfter ? '</body>' : '</head>'
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
if(${targetPath}) {
  if(item.tagName == 'link') {
    setAttribute(childNode, { href: ${targetPath} + item.attrs.href })
  } else if (item.tagName == 'script') {
    setAttribute(childNode, { src: ${targetPath} + item.attrs.src })
  }
}
document.getElementsByTagName(item.parentTagName)[0].appendChild(childNode);
}
})();
</script>
${endTag}
`


  return document.outerHTML.replace(endTag, injectCode)
}
