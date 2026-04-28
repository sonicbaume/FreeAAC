import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import { usePagesetActions } from "../stores/boards"
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
  const { replace } = useRouter()
  const { updateBoard } = usePagesetActions()

  useEffect(() => {
    ;(async () => {
      try {
        const manifest = await loadManifest(boardId as string)
        if (!manifest.root) return handleError("Root not found in manifest")
        updateBoard(boardId as string, { rootPage: manifest.root })
        replace(`/${boardId}/${manifest.root}`)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [boardId, replace, updateBoard])

  return <></>
}
