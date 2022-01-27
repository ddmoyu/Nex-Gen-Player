const { NaiveUiResolver } = require('unplugin-vue-components/resolvers')
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
      Components({
        resolvers: [NaiveUiResolver()],
        dts: 'src/typings/components.d.ts'
      })
    ]
  }
}
