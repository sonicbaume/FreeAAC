import { nanoid } from "nanoid/non-secure";
import { TileImage } from "./types";

const symbolApis = [ 'global' ] as const
const symbolApiUrls: Record<SymbolApi, string> = {
  global: 'https://globalsymbols.com/api/v1/labels/search'
}

type SymbolApi = typeof symbolApis[number]
type GlobalSymbolsResponse = {
  "id": number;
  "text": string;
  "text_diacritised": string;
  "description": string;
  "language": string;
  "picto": {
    "id": number;
    "symbolset_id": number;
    "part_of_speech": string;
    "image_url": string;
    "native_format": string;
    "adaptable": string;
    "symbolset"?: {
      "id": number;
      "slug": string;
      "name": string;
      "publisher": string;
      "publisher_url": string;
      "status": string;
      "licence": {
        "name": string;
        "url": string;
        "version": string;
        "properties": string;
      },
      "featured_level": number;
    }
  }
}

export const searchSymbols = async (text: string): Promise<TileImage[]> => {
  if (!text) return []
  const response = await fetch(
    symbolApiUrls.global +
    '?query=' + encodeURIComponent(text) +
    '&limit=50' +
    '&expand=picto.symbolset'
  )
  if (!response.ok) throw new Error('Failed to fetch symbols')
  const data = await response.json() as GlobalSymbolsResponse[]
  return data.map(item => {
    return {
      id: nanoid(),
      content_type: getMime(item.picto.native_format),
      data_url: item.picto.image_url,
      width: 460,
      height: 460,
      path: item.picto.image_url.split('/').at(-1) ?? '',
      url: item.picto.image_url,
      license: {
        author_name: item.picto.symbolset?.publisher,
        author_url: item.picto.symbolset?.publisher_url,
        copyright_notice_url: item.picto.symbolset?.licence.url,
        type: item.picto.symbolset?.licence.name,
      }
    }
  })
}

const getMime = (ext: string) => {
  switch (ext) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}