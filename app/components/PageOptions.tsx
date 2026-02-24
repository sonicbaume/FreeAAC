import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRouter } from "expo-router";
import { Copy, Fullscreen, Pencil, Settings } from "lucide-react-native";
import { Platform } from "react-native";
import { usePagesetActions } from "../stores/boards";
import { PADDING, useTheme } from "../utils/theme";
import SheetItem from "./SheetItem";

export default function PageOptions({
  ref,
  copyMessage,
}: {
  ref: React.RefObject<TrueSheet | null>;
  copyMessage?: () => void;
}) {
  const theme = useTheme()
  const { push } = useRouter()
  const { toggleEditMode } = usePagesetActions()

  const requestFullscreen = () => {
    if (Platform.OS !== "web") return
    const element = document.documentElement
    if (element.requestFullscreen) element.requestFullscreen()
    ref.current?.dismiss()
  }
  
  return (
    <TrueSheet
      ref={ref}
      detents={['auto']}
      backgroundColor={theme.surfaceContainer}
      style={{ padding: PADDING.xl }}
    >
      {copyMessage &&
      <SheetItem
        label="Copy to clipboard"
        icon={Copy}
        onPress={() => { copyMessage(); ref.current?.dismiss() }}
      />
      }
      <SheetItem
        label="Settings"
        icon={Settings}
        onPress={() => { ref.current?.dismiss(); push('/settings') }}
      />
      {Platform.OS === "web" &&
      <SheetItem
        label="Full screen"
        icon={Fullscreen}
        onPress={requestFullscreen}
      />
      }
      <SheetItem
        label="Edit board"
        icon={Pencil}
        onPress={() => { toggleEditMode(); ref.current?.dismiss() }}
      />
    </TrueSheet>
  )
}