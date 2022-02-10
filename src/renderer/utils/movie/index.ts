import { XMLParser } from 'fast-xml-parser'
// config with XML to JSON
const parser = new XMLParser({
  trimValues: true,
  textNodeName: '_t',
  ignoreAttributes: false,
  attributeNamePrefix: '_',
  parseAttributeValue: true
})

export function parserXml (xml:string) {
  const json = parser.parse(xml)
  console.log(json)
}
