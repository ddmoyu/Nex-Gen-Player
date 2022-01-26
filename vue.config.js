module.exports = {
  pages: {
    main: 'src/renderer/pages/main/main.ts',
    player: 'src/renderer/pages/player/main.ts'
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.ts',
      nodeIntegration: false,
      mainProcessWatch: ['src/main/'],
      preload: {
        preload: 'src/main/preload.ts'
      }
    }
  }
}
