import { shell } from 'electron'

export const Exec = {
  openExternal: (url: string): Promise<void> => shell.openExternal(url)
}
