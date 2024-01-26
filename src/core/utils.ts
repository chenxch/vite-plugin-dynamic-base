// replace
import {StringLiteral, TemplateElement} from "@swc/core";

export function replace(mark: string, placeholder: string, code: string) {
  const re = new RegExp(mark, 'g')
  return code.replace(re, placeholder)
}

// replace asset src
export function replaceSrc(placeholder: string, code: string) {
  return code.replace(/=([a-zA-Z]+).src/g, `=${placeholder}+$1.getAttribute('data-src')`)
}

export function replaceImport(placeholder: string, code: string) {
  return code.replace(/(System.import\()/g, `$1${placeholder}+`)
}

export function replaceInStringLiteral(literal: StringLiteral, base: string, placeholder: string): string {
  const quoteMark = literal.raw.charAt(0);
  const regex = new RegExp(base, 'g');
  // Keep track of whether we need to add quotation marks at the beginning of the
  // final output
  let withStartQuote = true;

  const transformedStr = literal.value.replace(regex, (match, index) => {
    let prefix = `${quoteMark}+`;

    if (index === 0) {
      prefix = '';
      withStartQuote = false;
    }

    return `${prefix}${placeholder}+${quoteMark}/`;
  });

  const prefix = withStartQuote ? quoteMark : '';

  return `${prefix}${transformedStr}${quoteMark}`;
}

export function replaceInTemplateElement(element: TemplateElement, base: string, placeholder: string): string {
  const regex = new RegExp(base, 'g');
  return element.raw.replace(regex, () => '/${' + placeholder + '}/');
}
