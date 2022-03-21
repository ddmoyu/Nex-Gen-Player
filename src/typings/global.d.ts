
declare interface Window {
  ipc: Preload.Ipc,
  shell: Preload.Exec,
  $message: Preload.Message
}
declare module 'xgplayer-hls.js'{
  import Plyer from 'xgplayer'
  export default Plyer
}
