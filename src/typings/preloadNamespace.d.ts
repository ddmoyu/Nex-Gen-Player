import { Exec } from '@/preload/Exec'
import { Ipc } from '@/preload/Ipc'
import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'

declare namespace Preload{
  type Ipc = typeof Ipc
  type Exec = typeof Exec
  type Message = MessageApiInjection
}

export = Preload
export as namespace Preload
