import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Trash2 } from "lucide-react-native";
import { useBoards, usePagesetActions } from "../stores/boards";
import { handleError } from "../utils/error";
import { removePath } from "../utils/io";
import { ICON_SIZE, PADDING, useTheme } from "../utils/theme";
import SheetItem from "./SheetItem";

export default function BoardOptions({
  ref,
  boardId,
}: {
  ref: React.RefObject<TrueSheet | null>;
  boardId: string | undefined;
}) {
  const theme = useTheme()
  const boards = useBoards()
  const { removeBoard } = usePagesetActions()
  const board = boards.find(b => b.id === boardId)

  const deleteBoard = () => {
    if (!board) return handleError("No board found")
    removePath(board.uri)
    removeBoard(board.id)
    ref.current?.dismiss()
  }

  return (
    <TrueSheet
      ref={ref}
      detents={['auto']}
      backgroundColor={theme.surfaceContainer}
      style={{ padding: PADDING.xl }}
    >
      <SheetItem
        label="Delete board"
        icon={<Trash2 size={ICON_SIZE.lg} color={theme.onSurface} />}
        onPress={deleteBoard}
      />
    </TrueSheet>
  )
}