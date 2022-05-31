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
      mainProcessWatch: ['src/main/', 'src/preload/'],
      preload: {
        preload: 'src/preload/index.ts'
      },
      builderOptions: {
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        appId: 'com.nexgen.player',
        copyright: 'Copyright @ 2022 ddmoyu',
        productName: 'Nex-Gen Player',
        // publish: [
        //   {
        //     provide: 'github',
        //     owner: 'ddmoyu',
        //     repo: 'Nex-Gen-Player'
        //   }
        // ],
        mac: {
          icon: 'build/icon/icon.icns',
          category: 'public.app-category.developer-tools',
          target: 'default',
          extendInfo: {
            LSUIElement: 1
          }
        },
        win: {
          icon: 'build/icons/icon.ico',
          target: 'nsis'
        },
        linux: {
          icon: 'build/icons/'
        },
        snap: {
          publish: ['github']
        }
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
    ],
    performance: {
      maxEntrypointSize: 5000000,
      maxAssetSize: 5000000
    }
  }
}
