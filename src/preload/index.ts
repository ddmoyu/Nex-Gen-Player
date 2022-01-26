import { contextBridge } from 'electron'
import { Ipc } from './Ipc'
import { Exec } from './Exec'

contextBridge.exposeInMainWorld('ipc', Ipc)

contextBridge.exposeInMainWorld('shell', Exec)
