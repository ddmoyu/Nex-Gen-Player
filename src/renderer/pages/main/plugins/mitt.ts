import mitt from 'mitt'

export type Events = {
  [key: string]: any
}

const bus = mitt<Events>()

export default bus
