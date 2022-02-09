import { ipcMain } from 'electron'
import { IpcDirective } from '../ipcEnum'
import win from '../router'

ipcMain.handle(IpcDirective.WIN_OPEN, (e, params) => {
  win.open(params ? params.name : '')
})

ipcMain.handle(IpcDirective.WIN_MINI, (e, params) => {
  win.mini(params ? params.name : '')
})

ipcMain.handle(IpcDirective.WIN_MAXIMIZE, (e, params) => {
  win.max(params ? params.name : '')
})

ipcMain.handle(IpcDirective.WIN_CLOSE, (e, params) => {
  win.close(params ? params.name : '')
})
