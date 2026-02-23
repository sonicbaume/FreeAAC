import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRouter } from "expo-router";
import { Copy, Fullscreen, LucideIcon, Pencil, Settings } from "lucide-react-native";
import { Platform } from "react-native";
import { usePagesetActions } from "../stores/boards";
import { FONT_SIZE, GAP, ICON_SIZE, PADDING, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

const OptionItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
}) => {
  const theme = useTheme()
  const Icon = icon
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      style={{
        justifyContent: 'flex-start',
        gap: GAP.xl,
        padding: PADDING.xl,
      }}
    >
      <Icon size={ICON_SIZE.lg} color={theme.onSurface} />
      <Text style={{ fontSize: FONT_SIZE.xl }}>{label}</Text>
    </Button>
  )
}

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
      <OptionItem
        label="Copy to clipboard"
        icon={Copy}
        onPress={() => { copyMessage(); ref.current?.dismiss() }}
      />
      }
      <OptionItem
        label="Settings"
        icon={Settings}
        onPress={() => { ref.current?.dismiss(); push('/settings') }}
      />
      {Platform.OS === "web" &&
      <OptionItem
        label="Full screen"
        icon={Fullscreen}
        onPress={requestFullscreen}
      />
      }
      <OptionItem
        label="Edit board"
        icon={Pencil}
        onPress={() => { toggleEditMode(); ref.current?.dismiss() }}
      />
    </TrueSheet>
  )
}