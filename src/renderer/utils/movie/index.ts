import { XMLParser } from 'fast-xml-parser'
import type { XMLToJSON } from './type'
// config with XML to JSON
const parser = new XMLParser({
  trimValues: true,
  textNodeName: '_t',
  ignoreAttributes: false,
  attributeNamePrefix: '',
  parseAttributeValue: true
})

export function parserXml (xml: string) {
  try {
    const { rss } = parser.parse(xml)
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
