import fs from 'fs'

export function getJSONFile (path: string) {
  const data = fs.readFileSync(path)
  const json = JSON.parse(data)
  return json
}
