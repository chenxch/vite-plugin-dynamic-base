## Changelog

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