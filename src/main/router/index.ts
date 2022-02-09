import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import WinConfig from './config'

class Router {
  windows: Map<string, BrowserWindow>
  windowSizeStatus:Map<string, boolean>
  constructor () {
    this.windows = new Map()
    this.windowSizeStatus = new Map()
  }

  // 【窗口】 最小化-
  mini (name: string) {
    const win = this.windows.get(name)
    win && win.minimize()
  }

  // 【窗口】 最大化
  max (name: string) {
    const status = this.windowSizeStatus.get(name)
    const win = this.windows.get(name)
    if (!win) return
    status ? win.unmaximize() : win.maximize()
    this.windowSizeStatus.set(name, !status)
  }

  // 【窗口】 关闭
  close (name: string) {
    const win = this.windows.get(name)
    win && win.close()
  }

  // 【窗口】 获取单个窗口
  get (name: string) {
    const win = this.windows.get(name)
    return win || BrowserWindow.getFocusedWindow()
  }

  // 获取当前窗口的是否最大化
  getIsMaximize (name:string) {
    return this.windowSizeStatus.get(name)
  }

  // 【窗口】 获取所有窗口
  getAll () {
    return this.windows
  }

  // 【窗口】 关闭所有
  closeAll () {
    BrowserWindow.getAllWindows().forEach(win => {
      win.close()
    })
    process.exit(0)
  }

  // 【窗口】 打开窗口
  async open (name: string, config?: BrowserWindowConstructorOptions) {
    const win = this.windows.get(name)
    if (win) {
      const isMax = this.windowSizeStatus.get(name)
      isMax && win.restore()
      win.focus()
      return false
    }

    const nw = await createWindow(name, config)
    this.windows.set(name, nw)
    nw.on('close', () => {
      nw && nw.hide()
      this.windows.delete(name)
      nw.destroy()
    })

    nw.once('ready-to-show', () => {
      nw.show()
    })

    return nw
  }
}

// 创建新的窗口
async function createWindow (name: string, config?: BrowserWindowConstructorOptions) {
  const _config = Object.assign(WinConfig.default, WinConfig[name], config)
  const devPath = name === 'index' ? '' : name

  const win = new BrowserWindow(_config)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + devPath)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    await win.loadURL(`app://./${name}.html`)
  }

  win.on('closed', () => { win.destroy() })

  return win
}

export default new Router()
