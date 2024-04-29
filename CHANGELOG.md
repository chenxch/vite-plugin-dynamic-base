## Changelog

### 1.0.3

_2024-04-29_

#### Chore

- add peerDependencies.

### 1.0.2

_2024-02-02_

#### Fix

- Fix failing transformations due to wrong string / template order.

### 1.0.1

_2024-02-02_

#### Feat

- Add support for replacement in template literals. ([#28](https://github.com/chenxch/vite-plugin-dynamic-base/pull/28) by [@joarfish](https://github.com/joarfish))


### 1.0.0

_2023-06-07_

#### Feat

- Using SWC for token transformation （[#23](https://github.com/chenxch/vite-plugin-dynamic-base/pull/23) by [@joarfish](https://github.com/joarfish)）


### 0.4.9

_2023-04-11_
#### Fix

- fix html template src parse ([#21](https://github.com/chenxch/vite-plugin-dynamic-base/issues/21))

### 0.4.8

_2023-01-15_
#### Fix

- fix legacy assets path ([#19](https://github.com/chenxch/vite-plugin-dynamic-base/issues/19) by [@jgsrty](https://github.com/jgsrty))

### 0.4.5

_2022-09-07_
#### Fix

- support aysnc load components.([#14](https://github.com/chenxch/vite-plugin-dynamic-base/issues/14))
### 0.4.4

_2022-06-24_
#### Feat

- support legacy modernPolyfills.([#9](https://github.com/chenxch/vite-plugin-dynamic-base/issues/9))

### 0.4.3

_2022-06-21_
#### Bug fixes

- template strings does not work.([#8](https://github.com/chenxch/vite-plugin-dynamic-base/issues/8))

### 0.4.1

_2022-05-09_
#### Bug fixes

- Legacy is invalid in browsers such as IE11.


### 0.4.0

_2022-05-01_

#### Features

- compatible `vite-plugin-pwa`
- base mark

#### Bug fixes

- Multi-level cdn reference resource path fix

#### Refactors

- Replace the matching scheme and use the base attribute as a marker bit
- Code structure adjustment, introduction of asynchronous processing


### 0.3.0

_2022-04-23_

#### Features

- setup simple unit tests with `vitest`. (#5 by @zhoujinfu)

#### Bug fixes

- import.env.LEGACY cause undefined errors with vite config `define`. (#5 by @zhoujinfu)