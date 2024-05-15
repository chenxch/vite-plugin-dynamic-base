export interface Options {
  publicPath?: string,
  transformIndexHtml?: boolean
  transformIndexHtmlConfig?: TransformIndexHtmlConfig
}

export interface TransformIndexHtmlConfig {
  insertBodyAfter?: boolean,
}

export interface TransformOptions extends Options {
  assetsDir: string,
  base: string,
  legacy: boolean
}