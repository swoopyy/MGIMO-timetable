import { DOMParser } from 'xmldom'
export function parse(data) {
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(data,"text/xml");
}
