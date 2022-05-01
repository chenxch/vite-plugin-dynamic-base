import { defineConfig } from 'vite'
import { dynamicBase as createPlugin } from '..'

describe('setup ok', () => {
  it('works', () => {
    expect(defineConfig({
      plugins: [createPlugin()],
    })).toMatchInlineSnapshot(`
      {
        "plugins": [
          {
            "apply": "build",
            "configResolved": [Function],
            "enforce": "post",
            "generateBundle": [Function],
            "name": "vite-plugin-dynamic-base",
            "transformIndexHtml": {
              "enforce": "post",
              "transform": [Function],
            },
          },
        ],
      }
    `)
  })
})
