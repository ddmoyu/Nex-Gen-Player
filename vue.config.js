module.exports = {
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
