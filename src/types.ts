export interface Options {
  publicPath?: string,
  transformIndexHtml?: boolean
  transformIndexHtmlConfig?: TransformIndexHtmlConfig
}

export interface TransformIndexHtmlConfig {
  insertBodyAfter?: boolean,
  publicPath?: string
}

export interface TransformOptions extends Options {
  assetsDir: string,
  base: string,
  legacy: boolean
}