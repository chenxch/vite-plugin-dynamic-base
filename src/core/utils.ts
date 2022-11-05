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
  const templateMark = `\`${mark}`;
  const templatePlaceholder = `\`\$\{${placeholder}\}/`;
  return replace(doubleMark, doublePlaceholder, replace(singleMark, singlePlaceholder, replace(templateMark, templatePlaceholder, code)));
}

// replace asset url
export function replaceUrl(mark: string, placeholder: string, code: string) {
  const urlMark = `url(${mark}`
  // const urlPlaceholder = `url("+${placeholder}+"/`
  const codeSpinner = code.split(urlMark)
  if(codeSpinner.length === 1) {
    return code
  }
  let rusultCode = ''
  for(let i = 0; i < codeSpinner.length-1; i++) {
    const codeItem = codeSpinner[i]
    const codeItemNext = codeSpinner[i+1]
    let quote =  Array.from(codeItem.matchAll(/'/g) || []).length % 2 === 1 ? "'" : '"'
    rusultCode += codeItem + `url(${quote}+${placeholder}+${quote}/` + codeItemNext
  }
  return rusultCode
}

// replace asset src
export function replaceSrc(placeholder: string, code: string) {
  return code.replace(/=([a-zA-Z]+).src/g, `=${placeholder}+$1.getAttribute('data-src')`)
}

export function replaceImport(placeholder: string, code: string) {
  return code.replace(/(System.import\()/g, `$1${placeholder}+`)
}
