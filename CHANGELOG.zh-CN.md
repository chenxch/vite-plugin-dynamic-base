## Changelog

### 0.4.3

_2022-06-21_
#### Bug fixes

- 修复字符串模板不工作.([#8](https://github.com/chenxch/vite-plugin-dynamic-base/issues/8))

### 0.4.1

_2022-05-09_
#### Bug fixes

- Legacy is invalid in browsers such as IE11.

### 0.4.0

_2022-05-01_

#### 新特性

- 兼容`vite-plugin-pwa`
- base标记

#### Bug 修复

- 多层级cdn引用资源路径修复

#### 重构

- 更换匹配方案，使用base属性作为标记位
- 代码结构调整，引入异步处理


### 0.3.0

_2022-04-23_

#### 新特性

- 添加简单的单元测试 `vitest`. (#5 by @zhoujinfu)

#### Bug 修复

- import.env.LEGACY 未定义的错误. (#5 by @zhoujinfu)