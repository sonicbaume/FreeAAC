import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect } from "react"
import { useBoards, usePagesetActions } from "../../stores/boards"
import { handleError } from "../../utils/error"
import { BoardButton, TileImage } from "../../utils/types"

export type EditTile = {
  button: BoardButton | undefined
  image: TileImage | undefined
  index: number
}

export default function Board() {
  const { boardId } = useLocalSearchParams()
  const { replace } = useRouter()
  const { updateBoard } = usePagesetActions()
  const boards = useBoards()

  useEffect(() => {
    ;(async () => {
      try {
        const rootPage = boards.find((board) => board.id === boardId)?.rootPage
        if (rootPage) return replace(`/${boardId}/${rootPage}`)
        throw new Error("Could not find root page")
      } catch (e) {
        handleError(e)
      }
    })()
  }, [boardId, replace, updateBoard])

  return <></>
}
