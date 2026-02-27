import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { useBoards, usePagesetActions } from "../stores/boards";
import { handleError } from "../utils/error";
import { deleteBoard } from "../utils/file";
import { ICON_SIZE, PADDING, useTheme } from "../utils/theme";
import DialogConfirm from "./DialogConfirm";
import DialogRename from "./DialogRename";
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
  const { removeBoard, renameBoard } = usePagesetActions()
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const board = boards.find(b => b.id === boardId)

  const handleRename = (name: string | undefined) => {
    if (!board) return handleError("No board found")
    if (!name) return handleError("No name provided")
    renameBoard(board.id, name)
    setShowRenameDialog(false)
    ref.current?.dismiss()
  }

  const handleDelete = async () => {
    if (!board) return handleError("No board found")
    await deleteBoard(board.uri)
    removeBoard(board.id)
    setShowDeleteDialog(false)
    ref.current?.dismiss()
  }

  return <>
    <TrueSheet
      ref={ref}
      detents={['auto']}
      backgroundColor={theme.surfaceContainer}
      style={{ padding: PADDING.xl }}
    >
      <SheetItem
        label="Rename board"
        icon={<Pencil size={ICON_SIZE.lg} color={theme.onSurface} />}
        onPress={() => {
          setShowRenameDialog(true)
          ref.current?.dismiss()
        }}
      />
      <SheetItem
        label="Delete board"
        icon={<Trash2 size={ICON_SIZE.lg} color={theme.onSurface} />}
        onPress={() => {
          setShowDeleteDialog(true)
          ref.current?.dismiss()
        }}
      />
    </TrueSheet>
    <DialogRename
      initialText={board?.name}
      visible={showRenameDialog}
      onCancel={() => setShowRenameDialog(false)}
      onConfirm={handleRename}
    />
    <DialogConfirm
      visible={showDeleteDialog}
      onCancel={() => setShowDeleteDialog(false)}
      onConfirm={handleDelete}
      message={`Are you sure you want to delete ${board?.name}?`}
    />
  </>
}