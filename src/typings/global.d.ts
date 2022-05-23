
declare interface Window {
  ipc: Preload.Ipc,
  shell: Preload.Exec,
  $message: Preload.Message
}
