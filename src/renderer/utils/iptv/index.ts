import { api } from '../fetch'
import parser, { PlaylistItem } from 'iptv-playlist-parser'

export async function m3uList (): Promise<PlaylistItem[]> {
  // const url = 'https://iptv-org.github.io/iptv/countries/cn.m3u'
  const url = 'https://iptv-org.github.io/iptv/categories/xxx.m3u'
  const res = await api(url, { parseResponse: txt => txt })
  const data = parser.parse(res)
  return data.items
}

// check online m3u url
export async function checkM3uUrl (url: string) {
  try {
    const resp = await api(url, { parseResponse: txt => txt })
    const data = parser.parse(resp)
    if (data && data.items.length > 0) return { flag: true, list: data.items }
    return { flag: false, list: [] }
  } catch (_) {
    return { flag: false, list: [] }
  }
}
