'use strict'

import { app } from 'electron'
import win from './router'
import './events'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

app.disableHardwareAcceleration()

// app.on('ready', () => {
//   win.open()
// })

app.whenReady().then(() => {
  win.open()
})

app.on('second-instance', () => {
  win.open()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const isDev = process.env.NODE_ENV !== 'production'
if (isDev) {
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
