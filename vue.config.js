const { NaiveUiResolver } = require('unplugin-vue-components/resolvers')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')

module.exports = {
  pages: {
    main: 'src/renderer/pages/main/main.ts',
    player: 'src/renderer/pages/player/main.ts'
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.ts',
      nodeIntegration: false,
      mainProcessWatch: ['src/main/', 'src/perload/'],
      preload: {
        preload: 'src/preload/index.ts'
      }
    }
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        dts: 'src/typings/auto-imports.d.ts',
        imports: [
          'vue',
          'vue-router'
        ]
      }),
      Components({
        dirs: ['src/renderer/components'],
        dts: 'src/typings/components.d.ts',
        resolvers: [NaiveUiResolver()]
      })
    ]
  }
}
