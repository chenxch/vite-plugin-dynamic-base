export interface Options {
  publicPath?: string,
  transformIndexHtml?: boolean
}

export interface TransformOptions extends Options {
  assetsDir: string,
  base: string,
  legacy: boolean
}