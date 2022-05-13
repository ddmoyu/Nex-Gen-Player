import { readFileSync, existsSync } from 'fs'
import { execFile, exec } from 'child_process'
import { clipboard, shell, nativeImage } from 'electron'

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

export function copy (type: string, data: string | HTMLCanvasElement) {
  if (type === 'text') {
    const txt = data as string
    clipboard.writeText(txt)
  }
  if (type === 'image') {
    const canvas = data as HTMLCanvasElement
    const png = canvas.toDataURL('image/png')
    const img = nativeImage.createFromDataURL(png)
    clipboard.writeImage(img)
  }
}
