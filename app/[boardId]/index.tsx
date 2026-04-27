import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import { handleError } from "../utils/error"
import { loadManifest } from "../utils/file"
import { BoardButton, TileImage } from "../utils/types"

export type EditTile = {
  button: BoardButton | undefined
  image: TileImage | undefined
  index: number
}

export default function Board() {
  const { boardId } = useLocalSearchParams()
  const id = boardId as string
  const { replace } = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        const manifest = await loadManifest(id)
        replace(`/${boardId}/${manifest.root}`)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [boardId, id, replace])

  return <></>
}
