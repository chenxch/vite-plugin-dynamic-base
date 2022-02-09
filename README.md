# vite-plugin-dynamic-assets

[![NPM version](https://img.shields.io/npm/v/vite-plugin-dynamic-assets?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-dynamic-assets)

- 🦾 Resolve all resource files dynamic publicpath, like Webpack's \_\_webpack__public__path__.

## Installation

```bash
npm i vite-plugin-dynamic-assets -D
```
## Build Mode

- [x] es
- [ ] system

## Usage

```ts
// vite.config.ts
import { dynamicPublicPath } from 'vite-plugin-dynamic-assets'

export default defineConfig({
  plugins: [
    dynamicPublicPath({ /* options */ }),
  ],
})
```

## Configuration

The following show the default values of the configuration

```ts
Components({
  // dynamic public path var string, default window.__rollup__public__path__
  publicPath: 'window.__rollup__public__path__'
})
```

