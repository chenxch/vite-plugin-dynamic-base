# vite-plugin-dynamic-base

[![NPM version](https://img.shields.io/npm/v/vite-plugin-dynamic-base?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-dynamic-base)

- 🦾 Resolve all resource files dynamic publicPath, like Webpack's `__webpack_public_path__`.

## Installation

```bash
npm i vite-plugin-dynamic-base -D
```
## Build Mode

- [x] es
- [x] system

## Usage

```ts
// vite.config.ts
import { dynamicBase } from 'vite-plugin-dynamic-base'

export default defineConfig({
  plugins: [
    dynamicBase({ /* options */ }),
  ],
})
```

## Configuration

The following show the default values of the configuration

```ts
dynamicBase({
  // dynamic public path var string, default window.__dynamic_base__
  publicPath: 'window.__dynamic_base__',
  // dynamic load resources on index.html, default false. maybe change default true
  transformIndexHtml:  false
})
```

## Plan

1. Exploring the feasibility of using SWC to transform the AST for processing