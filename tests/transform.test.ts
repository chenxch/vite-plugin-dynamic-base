import { describe, expect, test } from 'vitest'
import { transformChunk } from '../src/core/transform'

describe('transform', () => {
  const options = { publicPath: 'window.__dynamic_base__', assetsDir: 'assets', base: '/__dynamic_base__/', legacy: false, transformIndexHtml: false }
  
  test('transformChunk-es',  async () => {
    const code = `i = d('<div class="container-pc"><div class="bg"><img src="/__dynamic_base__/assets/asd.10e5228f.png" alt="" class="ignore-logo"><div class="ignore-title"></div><div class="ignore-sub-title"></div></div></div>;',1)`
    const result = await transformChunk(code, options)
    expect(result).toEqual(`i = d('<div class="container-pc"><div class="bg"><img src="'+window.__dynamic_base__+'/assets/asd.10e5228f.png" alt="" class="ignore-logo"><div class="ignore-title"></div><div class="ignore-sub-title"></div></div></div>;',1)`)
  })

  test('transformChunk-es-doublequote',  async () => {
    const code = `var ji=n("d", "/__dynamic_base__/assets/logo.03d6d6da.png")`
    const result = await transformChunk(code, options)
    expect(result).toEqual(`var ji=n("d", window.__dynamic_base__+"/assets/logo.03d6d6da.png")`)
  })
  

  test('transformChunk-system',  async () => {
    const code = `c.innerHTML="a[data-v-b4cdb4a4]{color:#42b983}label[data-v-b4cdb4a4]{margin:0 .5em;font-weight:700}code[data-v-b4cdb4a4]{background-color:#eee;padding:2px 4px;border-radius:4px;color:#304455}.base{width:100px;height:100px;background-image:url(/__dynamic_base__/assets/logo.03d6d6da.png)}#app{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50;margin-top:60px}"`
    const result = await transformChunk(code, options)
    expect(result).toEqual(`c.innerHTML="a[data-v-b4cdb4a4]{color:#42b983}label[data-v-b4cdb4a4]{margin:0 .5em;font-weight:700}code[data-v-b4cdb4a4]{background-color:#eee;padding:2px 4px;border-radius:4px;color:#304455}.base{width:100px;height:100px;background-image:url("+window.__dynamic_base__+"/assets/logo.03d6d6da.png)}#app{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-align:center;color:#2c3e50;margin-top:60px}"`)
  })
})