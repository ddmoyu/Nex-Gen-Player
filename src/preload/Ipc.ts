import { ipcRenderer, IpcRendererEvent } from 'electron'
export const Ipc = {
  invoke: (channel: string, args: any): void => {
    ipcRenderer.invoke(channel, args)
  },
  send: (channel: string, args: any[]): void => {
    ipcRenderer.send(channel, args)
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.on(channel, listener)
  },
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.once(channel, listener)
  },
  removeListener: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    ipcRenderer.removeListener(channel, listener)
  },
  removeAllListeners: (channel: string): void => {
    ipcRenderer.removeAllListeners(channel)
  }
}
