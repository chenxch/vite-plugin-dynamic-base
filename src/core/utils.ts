// replace
export function replace(mark: string, placeholder: string, code: string) {
  const re = new RegExp(mark, 'g')
  return code.replace(re, placeholder)
}

// repalce quotes
export function replaceQuotes(mark: string, placeholder: string, code: string) {
  const singleMark = `'${mark}`
  const singlePlaceholder = `${placeholder}+'/`
  const doubleMark = `"${mark}`
  const doublePlaceholder = `${placeholder}+"/`
  return replace(doubleMark, doublePlaceholder, replace(singleMark, singlePlaceholder, code))
}

// replace asset url
export function replaceUrl(mark: string, placeholder: string, code: string) {
  const urlMark = `url\\(${mark}`
  const urlPlaceholder = `url("+${placeholder}+"/`
  return replace(urlMark, urlPlaceholder, code)
}

// replace asset src
export function replaceSrc(placeholder: string, code: string) {
  return code.replace(/=([a-zA-Z]+).src/g, `=${placeholder}+$1.getAttribute('src')`)
}

export function replaceImport(placeholder: string, code: string) {
  return code.replace(/(System.import\()/g, `$1${placeholder}+`)
}
