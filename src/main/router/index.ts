import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { join } from 'path'

const defaultConfig: BrowserWindowConstructorOptions = {
  frame: false,
  width: app.isPackaged ? 1280 : 1680,
  height: 860,
  autoHideMenuBar: true,
  webPreferences: {
    devTools: !app.isPackaged,
    webSecurity: false,
    contextIsolation: false,
    nodeIntegration: true
  }
}

class Router {
  // 【窗口】 最小化
  public mini(): void {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.minimize()
  }

  // 【窗口】 最大化
  public max(): void {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.isMaximized() ? win.unmaximize() : win.maximize()
  }

  // 【窗口】 关闭
  public close(): void {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  }

  public async open(config?: BrowserWindowConstructorOptions): Promise<BrowserWindow> {
    let win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.isMaximized() ? win.unmaximize() : win.maximize()
    } else {
      win = await this.createWindow(config)
    }
    return win
  }

  private async createWindow(config?: BrowserWindowConstructorOptions): Promise<BrowserWindow> {
    const _config = Object.assign(defaultConfig, config)
    const win = new BrowserWindow(_config)

    if (app.isPackaged) {
      const filePath = join(__dirname, '../index.html')
      win.loadFile(filePath)
    } else {
      const URL = process.env.VITE_DEV_SERVER_URL
      await win.loadURL(`${URL}/index.html`)
      win.webContents.openDevTools()
    }

    win.on('closed', () => {
      win.destroy()
    })

    return win
  }
}

export default new Router()
