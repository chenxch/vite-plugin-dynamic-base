# vite-plugin-dynamic-base

[![NPM version](https://img.shields.io/npm/v/vite-plugin-dynamic-base?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-dynamic-base)

<p align='center'>
<b>English</b> | <a href="https://github.com/chenxch/vite-plugin-dynamic-base/blob/main/README.zh-CN.md">简体中文</a>
</p>

- 🦾 Resolve all resource files dynamic publicPath, like Webpack's `__webpack_public_path__`.


## Installation

```bash
npm i vite-plugin-dynamic-base -D
```


## Changelog

### 0.4.0

_2022-05-01_

#### Features

- compatible `vite-plugin-pwa`
- base mark
(From the original automatic search and replacement to using base as the marker bit to replace, this is for more accurate processing, and in some scenarios in pwa, you need to use base as the marker bit)

#### Bug fixes

- Multi-level cdn reference resource path fix

#### Refactors

- Replace the matching scheme and use the base attribute as a marker bit
- Code structure adjustment, introduction of asynchronous processing

[Changelogs](./CHANGELOG.md)


## Build Mode

- [x] es
- [x] system

## Compatible plugins

- [x] [@vitejs/plugin-legacy](https://www.npmjs.com/package/@vitejs/plugin-legacy)
- [x] [vite-plugin-pwa](https://www.npmjs.com/package/vite-plugin-pwa)

## Usage

```ts
// vite.config.ts
import { dynamicBase } from 'vite-plugin-dynamic-base'

export default defineConfig({
  // base: "/",
  base: process.env.NODE_ENV === "production" ? "/__dynamic_base__/" : "/",
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