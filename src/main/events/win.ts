import { dialog, ipcMain, app } from 'electron'
import { IpcDirective } from '../ipcEnum'
import win from '../router'
import os from 'os'
import { OpenDialogOptions } from 'electron/main'
import { getJSONFile, openLink, playWithExternalPlayer } from './tools'
import { writeFile } from 'fs'

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

ipcMain.handle(IpcDirective.IMPORT_JSON, e => {
  const w = win.get()
  if (!w) return false
  dialog.showOpenDialog(w).then(res => {
    if (res.canceled) return false
    const path = res.filePaths[0]
    const json = getJSONFile(path)
    e.sender.send(IpcDirective.IMPORT_JSON_REPLAY, json)
  })
})

ipcMain.handle(IpcDirective.PLAY_WITH, (e, params) => {
  playWithExternalPlayer(params.path, params.urls)
})

ipcMain.handle(IpcDirective.SHELL, (e, params) => {
  openLink(params.url)
})

ipcMain.handle(IpcDirective.WIN_SAVE_DIALOG, (e, params) => {
  const w = win.get()
  if (!w) return false
  dialog.showSaveDialog(w, { filters: [{ extensions: ['json'], name: 'json' }] }).then(res => {
    if (res.canceled) return false
    const path = res.filePath
    writeFile(path, params.data, (err) => {
      if (err) {
        e.sender.send(IpcDirective.WIN_DIALOG_REPLAY, false)
      } else {
        e.sender.send(IpcDirective.WIN_DIALOG_REPLAY, true)
      }
    })
  })
})
