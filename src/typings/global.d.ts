declare interface Window {
  ipc: Preload.Ipc,
  shell: Preload.Exec
}
declare module 'xgplayer-hls.js'{
  import Plyer from 'xgplayer'
  export default Plyer
}
