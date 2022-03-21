import { dialog, ipcMain, app } from 'electron'
import { IpcDirective } from '../ipcEnum'
import win from '../router'
import os from 'os'
import { OpenDialogOptions } from 'electron/main'

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

ipcMain.handle(IpcDirective.SYS_OS, (e) => {
  const sys = os.platform()
  e.sender.send(IpcDirective.SYS_OS_REPLAY, sys)
})

ipcMain.handle(IpcDirective.SYS_LANGUAGE, e => {
  const lang = app.getLocale()
  e.sender.send(IpcDirective.SYS_LANGUAGE_REPLAY, lang)
})

ipcMain.handle(IpcDirective.WIN_DIALOG, (e, args: OpenDialogOptions) => {
  const w = win.get()
  if (!w) return false
  dialog.showOpenDialog(w, args).then(res => {
    e.sender.send(IpcDirective.WIN_DIALOG_REPLAY, res)
  })
})
