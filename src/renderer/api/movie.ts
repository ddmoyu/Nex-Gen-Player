import { apiFetch } from '../utils/fetch'
import { parserXml } from '../utils/movie'

export async function fetchClassByKey () {
  const res = await apiFetch('http://www.kuaibozy.comc/api.php/provide/vod/fro')
  parserXml(res)
}
