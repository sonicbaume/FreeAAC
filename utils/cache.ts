import { AACTree } from "@willwade/aac-processors/browser"
import { Image } from "expo-image"

export const preloadTreeImages = (tree: AACTree) => {
  const urls = Object.values(tree.pages)
    .map((page) => page.images ?? [])
    .flatMap((images) =>
      images.map((image) => {
        if (!image.data || !image.data.startsWith("data:")) {
          return image.url
        }
        return undefined
      }),
    )
    .filter((url) => url !== undefined)
  console.info(`Preloading ${urls.length} images`)
  Image.prefetch(urls, "disk")
}

export const preloadImage = (url: string) => {
  console.info(`Preloading image ${url}`)
  Image.prefetch(url, "disk")
}
