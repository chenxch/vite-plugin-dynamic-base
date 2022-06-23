# vite-plugin-dynamic-base

[![NPM version](https://img.shields.io/npm/v/vite-plugin-dynamic-base?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-dynamic-base)

<p align='center'>
<a href="https://github.com/chenxch/vite-plugin-dynamic-base/blob/main/README.md">English</a> | <b>简体中文</b>
</p>

- 🦾 解析所有资源文件动态路径（多cdn切换）, 类似 Webpack 的 `__webpack_public_path__`.

## 安装

```bash
npm i vite-plugin-dynamic-base -D
```

## 变更日志

### 0.4.4

_2022-06-24_
#### Feat

- 支持 legacy modernPolyfills.([#9](https://github.com/chenxch/vite-plugin-dynamic-base/issues/9))


[变更日志](./CHANGELOG.zh-CN.md)

## 编译模式

- [x] es
- [x] system

## 兼容插件

- [x] [@vitejs/plugin-legacy](https://www.npmjs.com/package/@vitejs/plugin-legacy)
- [x] [vite-plugin-pwa](https://www.npmjs.com/package/vite-plugin-pwa)


## 使用

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

## 配置

以下显示配置的默认值

```ts
dynamicBase({
  // dynamic public path var string, default window.__dynamic_base__
  publicPath: 'window.__dynamic_base__',
  // dynamic load resources on index.html, default false. maybe change default true
  transformIndexHtml:  false
})
```

## 计划

1. 探索利用SWC改造AST进行加工的可行性
