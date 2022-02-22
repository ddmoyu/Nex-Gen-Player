import { api } from '../fetch'
import { XMLParser } from 'fast-xml-parser'
import type { XMLToJSON, ClassType } from './type'

// config with XML to JSON
const parser = new XMLParser({
  trimValues: true,
  textNodeName: '_t',
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true
})

// check response type
function checkResType (res: string) {
  if (res.startsWith('<?xml')) return 'XML'
  if (res.startsWith('{"code":1')) return 'JSON'
  return ''
}

async function getXMLClass (xml: string) {
  const json = parser.parse(xml)
  const res = json.rss ? json.rss : json
  const data: ClassType = {
    class: res.class.ty,
    list: {
      pagecount: res.list.pagecount,
      pagesize: res.list.pagesize,
      recordcount: res.list.recordcount
    }
  }
  return data
}

async function getJSONClass (txt: string) {
  const json = JSON.parse(txt)
  const data: ClassType = {
    class: json.class,
    list: {
      pagecount: Number(json.pagecount),
      pagesize: Number(json.limit),
      recordcount: Number(json.total)
    }
  }
  return data
}

// get site class
export async function getClass (url: string) {
  try {
    const res = await api(url)
    const type = checkResType(res)
    if (type === 'XML') {
      return await getXMLClass(res)
    }
    if (type === 'JSON') {
      return await getJSONClass(res)
    }
    return false
  } catch (ignore) {
    return false
  }
}

// get site video list
export async function getVideoList (url: string, page?: number, clsId?: number) {
  try {
    const pg = page || 1
    const uri = clsId ? `${url}?ac=videolist&t=${clsId}&pg=${pg}` : `${url}?ac=videolist&pg=${pg}`
    const xml = await api(uri)
    console.log('xml: ', xml)
    const res = parser.parse(xml)
    const json = res.rss ? res.rss : res
    const data = json.list.video
    return data
  } catch (ignore) {}
}

// search video
export async function search (url: string, wd: string) {
  try {
    const uri = `${url}?wd=${encodeURI(wd)}`
    const xml = await api(uri)
    console.log('xml: ', xml)
    const res = parser.parse(xml)
    const json = res.rss ? res.rss : res
    const data = json.list.video
    return data
  } catch (ignore) {}
}

// get video detail
export async function getDetail (url: string, id: number) {
  try {
    const uri = `${url}?ac=videolist&ids=${id}`
    const xml = await api(uri)
    console.log('xml: ', xml)
    const res = parser.parse(xml)
    const json = res.rss ? res.rss : res
    const data = json.list.video
    return data
  } catch (ignore) {}
}

export function parserXml (xml: string) {
  try {
    const { rss } = parser.parse(xml)
    console.log('rss: ', rss)
    const res = {
      class: rss.class.ty,
      list: rss.list
    } as XMLToJSON
    return res
  } catch (error) {
    // TODO:do something processing error
    console.log('[response parser error]', error)
  }
  return { class: [], list: { video: [], page: 0, pagecount: 0, pagesize: 0, recordcount: 0 } } as XMLToJSON
}
