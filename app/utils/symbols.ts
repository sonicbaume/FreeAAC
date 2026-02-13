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

export const searchSymbols = async (text: string): Promise<string[]> => {
  if (!text) return []
  const response = await fetch(
    symbolApiUrls.global +
    '?query=' + encodeURIComponent(text) +
    '&limit=50'
  )
  if (!response.ok) throw new Error('Failed to fetch symbols')
  const data = await response.json() as GlobalSymbolsResponse[]
  return data.map(item => item.picto.image_url)
}
