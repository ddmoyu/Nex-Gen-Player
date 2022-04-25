'use strict'

import { app, protocol, BrowserWindow, session } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import win from './router'
import { registerIpcEvent } from './events'
import { registerShortcut, unregisterShortcut } from './shortcut/shortcut'
import path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    unregisterShortcut()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) win.open('main')
})

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (err) {
      console.error('Vue Devtools failed to install:', JSON.stringify(err))
    }
  }
  win.open('main')
  registerShortcut()
  registerIpcEvent()
  // autoUpdater.checkForUpdatesAndNotify()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
