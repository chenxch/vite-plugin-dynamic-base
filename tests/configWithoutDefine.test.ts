import { defineConfig, InlineConfig, resolveConfig } from 'vite'
import { dynamicBase as createPlugin } from '..'

describe('vite `define` cause null pointer exception in `configResolved`', () => {
  const plugin = createPlugin()

  it('works well with `define`', async () => {
    const configWithDefine = defineConfig({
      define: {},
      plugins: [plugin],
    }) as InlineConfig
    await expect(resolveConfig(configWithDefine, 'build')).resolves.toMatchSnapshot()
  })

  it('exception occurs', async () => {
    const configWithoutDefine = defineConfig({
      plugins: [plugin],
    }) as InlineConfig
    // await expect(() => resolveConfig(configWithoutDefine, 'build')).rejects.toMatch(
    //   /TypeError: Cannot read property 'import\.meta\.env\.LEGACY' of undefined/,
    // )
    await expect(resolveConfig(configWithoutDefine, 'build')).resolves.toMatchSnapshot()
  })
})