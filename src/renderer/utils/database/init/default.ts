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
    language: 'en-US',
    os: '',
    shortcut: {
      toggle: false,
      localKey: {
        play: 'space'
      }
    },
    player: '',
    downloader: '',
    exclude: {
      classToggle: false,
      class: ['伦理', '福利'],
      txtToggle: false,
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
    },
    siteUrls: [
      { id: 0, url: 'https://gist.githubusercontent.com/ddmoyu/cbc89ccc52a5b10e6371c418a5c5135b/raw/04f46b54d4aebd0cf464191d346e3325ea862209/tv.json', active: true, state: true, loading: false }
    ]
  }
]
