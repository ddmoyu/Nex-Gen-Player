import path from 'path'
import { app, BrowserWindowConstructorOptions } from 'electron'

const isDevelopment = process.env.NODE_ENV !== 'production'

interface BWConfig {
  [type: string]: BrowserWindowConstructorOptions
}

const config: BWConfig = {
  default: {
    webPreferences: {
      devTools: !app.isPackaged,
      webSecurity: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    }
  },
  main: {
    frame: false,
    width: isDevelopment ? 1680 : 1280,
    height: 860
  },
  player: {
    frame: true,
    width: isDevelopment ? 1460 : 860,
    height: 670,
    autoHideMenuBar: true
  }
}

export default config
