import { readFileSync, existsSync } from 'fs'
import { execFile, exec } from 'child_process'
import { shell } from 'electron'

export function getJSONFile (path: string) {
  const data = readFileSync(path)
  const json = JSON.parse(data)
  return json
}

export function playWithExternalPlayer (path: string, urls: string) {
  const flag = existsSync(path)
  if (flag) {
    execFile(path, urls.split(','))
  } else {
    exec(path + ' ' + urls)
  }
}

export function openLink (url: string) {
  shell.openExternal(url)
}
