import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useRouter } from "expo-router"
import { speak } from "expo-speech"
import {
  Copy,
  Fullscreen,
  Keyboard,
  Pencil,
  Settings,
} from "lucide-react-native"
import { useState } from "react"
import { Platform } from "react-native"
import { useCurrentPageId, usePagesetActions } from "../stores/boards"
import { usePlayOnPress } from "../stores/prefs"
import { generateNewButton } from "../utils/boards"
import { ICON_SIZE, PADDING, useTheme } from "../utils/theme"
import DialogRename from "./DialogRename"
import SheetItem from "./SheetItem"

export default function PageOptions({
  ref,
  copyMessage,
}: {
  ref: React.RefObject<TrueSheet | null>
  copyMessage?: () => void
}) {
  const theme = useTheme()
  const [showCustomWordDialog, setShowCustomWordDialog] = useState(false)
  const { push } = useRouter()
  const { toggleEditMode, addCustomMessage, addMessageButtonId, logEvent } =
    usePagesetActions()
  const currentPageId = useCurrentPageId()
  const playOnPress = usePlayOnPress()

  const requestFullscreen = () => {
    if (Platform.OS !== "web") return
    const element = document.documentElement
    if (element.requestFullscreen) element.requestFullscreen()
    ref.current?.dismiss()
  }

  const addCustomWord = (word: string | undefined) => {
    if (currentPageId && word) {
      const button = generateNewButton(currentPageId)
      button.label = word
      button.message = word
      addCustomMessage(button.id, button.message)
      addMessageButtonId({ id: button.id, pageId: currentPageId })
      if (playOnPress) speak(word)
      logEvent({
        type: "button",
        button,
        spoken: playOnPress,
      })
    }
    setShowCustomWordDialog(false)
  }

  return (
    <>
      <TrueSheet
        ref={ref}
        detents={["auto"]}
        backgroundColor={theme.surfaceContainer}
        style={{ padding: PADDING.xl }}
      >
        <SheetItem
          label="Type word"
          icon={<Keyboard size={ICON_SIZE.lg} color={theme.onSurface} />}
          onPress={() => {
            if (!currentPageId)
              return console.error("Could not find currentPageId")
            setShowCustomWordDialog(true)
            ref.current?.dismiss()
          }}
        />
        {copyMessage && (
          <SheetItem
            label="Copy to clipboard"
            icon={<Copy size={ICON_SIZE.lg} color={theme.onSurface} />}
            onPress={() => {
              copyMessage()
              ref.current?.dismiss()
            }}
          />
        )}
        <SheetItem
          label="Settings"
          icon={<Settings size={ICON_SIZE.lg} color={theme.onSurface} />}
          onPress={() => {
            ref.current?.dismiss()
            push("/settings")
          }}
        />
        {Platform.OS === "web" && (
          <SheetItem
            label="Full screen"
            icon={<Fullscreen size={ICON_SIZE.lg} color={theme.onSurface} />}
            onPress={requestFullscreen}
          />
        )}
        <SheetItem
          label="Edit board"
          icon={<Pencil size={ICON_SIZE.lg} color={theme.onSurface} />}
          onPress={() => {
            toggleEditMode()
            ref.current?.dismiss()
          }}
        />
      </TrueSheet>
      <DialogRename
        visible={showCustomWordDialog}
        onCancel={() => setShowCustomWordDialog(false)}
        onConfirm={addCustomWord}
        message="Please type the word to add"
        confirmLabel="Add"
      />
    </>
  )
}
