import { Exec } from '@/preload/Exec'
import { Ipc } from '@/preload/Ipc'

declare namespace Preload{
  type Ipc = typeof Ipc
  type Exec = typeof Exec
}

export = Preload
export as namespace Preload
