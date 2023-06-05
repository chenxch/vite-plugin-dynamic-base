// replace
import {StringLiteral} from "@swc/core";

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
  // Keep track of whether we need to add quotation marks at the beginning/end of the
  // final output
  let withEndQuote = true;
  let withStartQuote = true;

  const c = literal.value.replace(regex, (match, index, original) => {
    let prefix = `${quoteMark}+`;
    let suffix = `+${quoteMark}`;

    if (index === 0) {
      prefix = '';
      withStartQuote = false;
    }

    if (index + match.length === original.length) {
      suffix = '';
      withEndQuote = false;
    }

    return `${prefix}${placeholder}${suffix}/`;
  });

  const prefix = withStartQuote ? quoteMark : '';
  const suffix = withEndQuote ? quoteMark : '';

  return `${prefix}${c}${suffix}`;
}
