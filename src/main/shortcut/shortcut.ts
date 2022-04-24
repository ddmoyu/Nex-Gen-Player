import { BrowserWindow, globalShortcut } from 'electron'

export function registerShortcut () {
  let isHided = false
  const wins = BrowserWindow.getAllWindows()
  const failedList = []
  const altQ = globalShortcut.register('Alt+Q', () => {
    wins.forEach(win => {
      win.setSkipTaskbar(!isHided)
      isHided ? win.show() : win.hide()
    })
    isHided = !isHided
  })
  if (!altQ) failedList.push('Alt+Q')
  /** Shortcut key conflict */
  return failedList
}

export function unregisterShortcut () {
  globalShortcut.unregisterAll()
}
