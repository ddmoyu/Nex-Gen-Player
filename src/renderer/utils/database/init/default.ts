export const initSettings = [
  {
    id: 0,
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
      class: '伦理,福利',
      videoToggle: false,
      video: '激情'
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
      {
        id: 0,
        name: '奈菲迷高清源',
        url: 'https://nfm-blu-ray.naifeimi.com/upload/jsonapi/naifeimiapi.json',
        active: true,
        state: true,
        loading: false
      },
      {
        id: 1,
        name: '网络源',
        url: 'https://gist.githubusercontent.com/ddmoyu/cbc89ccc52a5b10e6371c418a5c5135b/raw/',
        active: true,
        state: true,
        loading: false
      }
    ]
  }
]
