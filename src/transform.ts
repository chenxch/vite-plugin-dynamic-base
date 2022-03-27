// import MagicString from 'magic-string'

export function transformAssets(format, bundle, options) {
  const { base, assetsDir, publicPath, legacy, transformIndexHtml } = options
  if (format !== 'es' && format !== 'system') {
    return
  }
  const assetsMarker = `${base}${assetsDir}/`
  for (const file in bundle) {
    const chunk = bundle[file]
    const assetsMarkerRE = new RegExp(`("${assetsMarker}[.\\w]*")`, 'g')
    if (chunk.type === 'chunk' && chunk.code.indexOf(assetsMarker) > -1) {
      chunk.code = chunk.code.replace(assetsMarkerRE, `${publicPath}+$1`)
      if (format === 'system') {
        // replace css url
        const assetsUrlRE = new RegExp(`url\\((${assetsMarker}[.\\w]*)\\)`, 'g')
        chunk.code = chunk.code.replace(assetsUrlRE, `url("+${publicPath}+"$1)`)
      }
    }
    if (legacy && chunk.type === 'asset' && chunk.fileName.endsWith('.html') && transformIndexHtml) {
      // console.log(chunk.source)
      chunk.source = (chunk.source as string)
        .replace(/=([a-zA-Z]+.src)/g, `=${publicPath}+$1`)
        .replace(/(System.import\()/g, `$1${publicPath}+`)
    }
  }
}
