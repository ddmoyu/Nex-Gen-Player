import { apiFetch } from '../utils/fetch'
import { parserXml } from '../utils/movie'

export async function fetchClassByKey () {
  // const res = await apiFetch('http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/')
  const res = await apiFetch('https://api.tiankongapi.com/api.php/provide/vod/at/xml/from/tkm3u8/')
  return parserXml(res)
}
