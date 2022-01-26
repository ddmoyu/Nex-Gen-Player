import { ipcMain, shell, dialog } from 'electron'
import { OpenDialogOptions } from 'electron/main'
import win from '../router'

ipcMain.handle('event.win.open', (e, args) => {
  const params = args[0]
  win.open(params.name)
})

ipcMain.handle('event.win.mini', (e, args) => {
  win.mini(args.name)
})

ipcMain.handle('event.win.max', (e, args) => {
  win.max(args.name)
})

ipcMain.handle('event.win.close', (e, args) => {
  const params = args[0]
  win.close(params.name)
})

ipcMain.handle('event.win.openDir', (e, args) => {
  shell.showItemInFolder(args)
})

ipcMain.handle('event.win.dialog', (e, args: OpenDialogOptions) => {
  const w = win.get('home')
  if (!w) return false
  dialog.showOpenDialog(w, args).then(res => {
    e.sender.send('event.win.dialog_replay', res)
  })
})
