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

export function replaceInStringLiteral(literal: StringLiteral, base: string, placeholder: string, removeStartingSlash: boolean): string {
  const quoteMark = literal.raw.charAt(0);
  const regex = new RegExp(base, 'g');
  // Keep track of whether we need to add quotation marks at the beginning of the
  // final output

  const resourceStartingSlash = removeStartingSlash ? '' : '/';

  /**
   * original StringLiteral may have escaped quote marks, so we need to use raw instead of value
   * otherwise, will fail on style strings such as 
   * "@charset \"UTF-8\";cursor: url(/__vite_dynamic_public_path__/assets/cursor.svg);"
   * 
   * since the value is 
   * @charset "UTF-8";cursor: url(/__vite_dynamic_public_path__/assets/cursor.svg);
   * 
   * and does not reflect the escaped quote marks
   */
  const transformedStr = literal.raw.replace(regex, (match, index) => {
    let prefix = `${quoteMark}+`;

    if (index === 0) {
      prefix = '';
    }

    return `${prefix}${placeholder}+${quoteMark}${resourceStartingSlash}`;
  });

  return `${transformedStr}`;
}

export function replaceInTemplateElement(element: TemplateElement, base: string, placeholder: string, removeStartingSlash: boolean): string {
  const resourceStartingSlash = removeStartingSlash ? '' : '/';
  const regex = new RegExp(base, 'g');
  return element.raw.replace(regex, () => '/${' + placeholder + '}' + resourceStartingSlash);
}
