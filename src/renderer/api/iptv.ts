import { $fetch } from 'ohmyfetch'
import parser, { PlaylistItem } from 'iptv-playlist-parser'

export async function m3uList (): Promise<PlaylistItem[]> {
  // const url = 'https://iptv-org.github.io/iptv/countries/cn.m3u'
  const url = 'https://iptv-org.github.io/iptv/categories/xxx.m3u'
  const res = await $fetch(url, { parseResponse: txt => txt })
  const data = parser.parse(res)
  return data.items
}
