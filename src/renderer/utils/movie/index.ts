import { api } from '../fetch'
import { XMLParser } from 'fast-xml-parser'
import type { ClassType, VideoDetailType } from '../../../typings/video'
import { Site } from '../database/models/Site'

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

// get xml site class
async function getXMLClass (txt: string) {
  const json = parser.parse(txt)
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
// get json site class
async function getJSONClass (txt: string) {
  const json = JSON.parse(txt)
  const cls = []
  for (const i of json.class) {
    cls.push({ _t: i.type_name, id: i.type_id })
  }
  const data: ClassType = {
    class: cls,
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

// get xml site video list
async function getXMLVideoList (txt: string) {
  const json = parser.parse(txt)
  const res = json.rss ? json.rss : json
  const data: VideoDetailType[] = []
  const list = res.list.video
  if (!res.list.video) return false
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      const l = list[i]
      const item: VideoDetailType = { id: l.id, name: l.name, class: l.class || l.type, pic: l.pic, lang: l.lang, area: l.area, year: l.year, total: l.total, content: l.content || l.des, actor: l.actor, director: l.director, writer: l.writer, duration: l.duration, last: l.last, note: l.note, urls: [] }
      const dd = l.dl.dd
      if (Array.isArray(dd)) {
        for (const j of dd) {
          if (j.flag.endsWith('m3u8')) {
            const m = j._t.split('#')
            for (const k of m) {
              const n = k.split('$')
              item.urls.push(n[1])
            }
          }
        }
      } else {
        const flag = dd.flag
        if (flag && dd._t) {
          const m = dd._t.split('#')
          for (const k of m) {
            if (k.endsWith('.m3u8')) {
              const n = k.split('$')
              item.urls.push(n[1])
            }
          }
        }
      }
      data.push(item)
    }
  } else {
    const l = list
    const item: VideoDetailType = { id: l.id, name: l.name, class: l.class || l.type, pic: l.pic, lang: l.lang, area: l.area, year: l.year, total: l.total, content: l.content, actor: l.actor, director: l.director, writer: l.writer, duration: l.duration, last: l.last, urls: [] }
    const dd = l.dl.dd
    if (Array.isArray(dd)) {
      for (const j of dd) {
        if (j.flag.endsWith('m3u8')) {
          const m = j._t.split('#')
          for (const k of m) {
            const n = k.split('$')
            item.urls.push(n[1])
          }
        }
      }
    } else {
      const flag = dd.flag
      if (flag && flag.endsWith('m3u8') && dd._t) {
        const m = dd._t.split('#')
        for (const k of m) {
          const n = k.split('$')
          item.urls.push(n[1])
        }
      }
    }
    data.push(item)
  }
  if (!data.length) return false
  return data
}

// get json site video list
async function getJSONVideoList (txt: string) {
  const json = JSON.parse(txt)
  const data: VideoDetailType[] = []
  if (!json.list || !json.list.length) return false
  const list = json.list
  for (let i = 0; i < list.length; i++) {
    const l = list[i]
    const item: VideoDetailType = { id: l.vod_id, name: l.vod_name, class: l.type_name, pic: l.vod_pic, lang: l.vod_lang, area: l.vod_area, year: l.vod_time, total: l.vod_total, content: l.vod_content, actor: l.vod_actor, director: l.vod_director, writer: l.vod_writer, duration: l.vod_duration, last: l.vod_pubdate, note: l.vod_remarks, urls: [] }
    const u = l.vod_play_url
    const note = l.vod_play_note
    if (!u && !note) break
    if (note === '') {
      const uArr = u.split('#')
      for (const j of uArr) {
        if (j.endsWith('.m3u8')) {
          const n = j.split('$')
          item.urls.push(n[1])
        }
      }
      data.push(item)
    } else {
      const uArr = u.split(note)
      for (const j of uArr) {
        if (j.endsWith('.m3u8')) {
          const m = j.split('#')
          for (const k of m) {
            const n = k.split('$')
            item.urls.push(n[1])
          }
        }
      }
      data.push(item)
    }
  }
  if (!data.length) return false
  return data
}

// get site video list
export async function getVideoList (url: string, page?: number, clsId?: number) {
  try {
    const pg = page || 1
    const uri = clsId ? `${url}?ac=videolist&t=${clsId}&pg=${pg}` : `${url}?ac=videolist&pg=${pg}`
    const res = await api(uri)
    const type = checkResType(res)
    if (type === 'XML') {
      return await getXMLVideoList(res)
    }
    if (type === 'JSON') {
      return await getJSONVideoList(res)
    }
    return false
  } catch (ignore) { }
}

// search video
export async function search (url: string, wd: string, page?: number) {
  try {
    const pg = page || 1
    const uri = `${url}?ac=videolist&pg=${pg}&wd=${encodeURI(wd)}`
    const res = await api(uri)
    const type = checkResType(res)
    if (type === 'XML') {
      return await getXMLVideoList(res)
    }
    if (type === 'JSON') {
      return await getJSONVideoList(res)
    }
    return false
  } catch (ignore) { }
}

export function getSiteById (id: number, sites: Site[]) {
  if (!sites.length) return false
  const site = sites.find(item => item.id === id)
  return site
}

export async function getRating (name: string, limit?: number, lang?: string, year?: number) {
  try {
    const uri = `https://api.wmdb.tv/api/v1/movie/search?q=${name}&limit=${limit || 10}&skip=0&lang=${lang || 'Cn'}${year ? '&year=' + year : ''}`
    const res = await api(uri)
    if (res && res.length) {
      for (const i of res) {
        if (i.data && i.data.length) {
          const d = i.data
          for (const j of d) {
            if (j.name === name) {
              const ratingList = []
              const douban = { name: 'Douban', rating: i.doubanRating, votes: i.doubanVotes }
              const imdb = { name: 'IMDB', rating: i.imdbRating, votes: i.imdbVotes }
              const rotten = { name: 'Rotten', rating: i.rottenRating, votes: i.rottenVotes }
              ratingList.push(douban, imdb, rotten)
              return ratingList
            }
          }
        }
      }
    }
    return []
  } catch (_) {
    return []
  }
}

// TODO: check api normal
export async function checkApi (url: string) {
  try {
    const resp = await api(url)
    if (resp) return true
    return false
  } catch (_) {
    return false
  }
}
