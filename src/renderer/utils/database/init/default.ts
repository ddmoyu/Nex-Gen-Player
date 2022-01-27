export const initSettings = [
  {
    id: 0,
    view: 'waterfull',
    windows: false,
    play: {
      multiple: false,
      minimize: false,
      switch: false
    },
    theme: 'light',
    language: 'zh_cn',
    shortcut: {
      toggle: false,
      localKey: {
        play: 'space'
      }
    },
    search: false,
    player: '',
    downloader: '',
    exclude: {
      type: ['伦理', '福利'],
      txt: ['激情']
    },
    proxy: {
      toggle: false,
      agree: '',
      ip: '',
      port: ''
    },
    password: {
      toggle: false,
      tips: '',
      password: ''
    }
  }
]
