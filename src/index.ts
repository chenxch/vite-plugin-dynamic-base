import type { Plugin, IndexHtmlTransformResult } from 'vite'
import { parse } from 'node-html-parser'
import { BinaryExpression, Expression, ExpressionStatement, StringLiteral } from '@swc/core';
import * as swc from '@swc/core';
import { Visitor } from '@swc/core/Visitor';

import type { Options } from '../index'

class PlaceholderReplacer extends Visitor {
  private readonly placeholder: string;
  private readonly expression: Expression;

  constructor(placeholder: string, expression: string) {
    super();
    this.placeholder = placeholder;
    this.expression = PlaceholderReplacer.parseExpression(expression);
  }

  static parseExpression(expression: string) {
    return (swc.parseSync(expression).body[0] as ExpressionStatement).expression;
  }

  // @ts-ignore We changed expression type
  visitStringLiteral(node: StringLiteral): Expression {
    const stringParts = node.value.split(this.placeholder);
    if (stringParts.length === 1) return node;

    const createStringExpression = (str: string): StringLiteral => ({
      type: 'StringLiteral',
      span: { start: 0, end: 0, ctxt: 0 },
      value: str,
      // @ts-ignore Typing is wrong: hasEscape => has_escape
      hasEscape: true,
      kind: { type: 'normal', containsQuote: true }
    });

    let subExpressions: Expression[] = Array(stringParts.length * 2 - 1);
    for (let i = 0; i < stringParts.length; i++) {
      subExpressions[i * 2] = createStringExpression(stringParts[i]);
      if (i !== stringParts.length - 1) {
        subExpressions[i * 2 + 1] = this.expression;
      }
    }

    subExpressions = subExpressions.filter(expr => expr.type !== 'StringLiteral' || expr.value !== '');

    if (subExpressions.length === 1) return subExpressions[0];

    const createAddExpression = (left: Expression): BinaryExpression => ({
      type: 'BinaryExpression',
      span: { start: 0, end: 0, ctxt: 0 },
      operator: '+',
      left: left,
      right: null
    });

    let rootExpression: Expression;
    let previousExpression: BinaryExpression;
    for (let i = 0; i < subExpressions.length; i++) {
      const currentSubExpression = subExpressions[i];
      if (i === 0) {
        previousExpression = rootExpression = createAddExpression(currentSubExpression);
      } else if (i === subExpressions.length - 1) {
        previousExpression.right = currentSubExpression;
      } else {
        previousExpression.right = createAddExpression(currentSubExpression);
        previousExpression = previousExpression.right;
      }
    }

    return rootExpression;
  }
}

export function dynamicBase(options?: Options): Plugin {
  const defaultOptions:Options ={
    publicPath: 'window.__dynamic_base__',
    transformIndexHtml: false // maybe default true
  } 
  
  const { 
    publicPath,
    transformIndexHtml
  } = {...defaultOptions ,...(options || {})}

  let assetsDir = 'assets'
  let base = '/'
  let minify = true

  return {
    name: 'vite-plugin-dynamic-base',
    enforce: 'post',
    apply: 'build',
    configResolved(resolvedConfig) {
      assetsDir = resolvedConfig.build.assetsDir
      base = resolvedConfig.base
      minify = !!resolvedConfig.build.minify
    },
    async generateBundle({ format }, bundle) {
      if (format !== 'es' && format !== 'system') {
        return
      }

      // To replace the placeholder in emitted asset files (e.g. .css)
      const assetsRE = new RegExp(`${base}${assetsDir}/`, 'g');

      await Promise.all(Object.entries(bundle).map(async ([, chunk]) => {
        if (chunk.type === 'chunk' && chunk.code.indexOf(base) > -1) {
          // For modern build, replace the preload URLs
          // For legacy build, replace the import URLs and URLs in inlined CSS
          const ast = await swc.parse(chunk.code);
          const replacer = new PlaceholderReplacer(base, publicPath);
          replacer.visitModule(ast);
          chunk.code = (await swc.print(ast, { minify })).code;
        } else if (chunk.type === 'asset' && typeof chunk.source === "string" && chunk.fileName.endsWith(".css")) {
          // Emitted asset files for modern build, just let them use relative paths
          chunk.source = chunk.source.replace(assetsRE, "");
        }
      }));
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
