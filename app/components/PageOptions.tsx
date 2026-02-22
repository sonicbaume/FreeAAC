import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRouter } from "expo-router";
import { Copy, Fullscreen, LucideIcon, Pencil, Settings } from "lucide-react-native";
import { Platform, Pressable, Text } from "react-native";
import { usePagesetActions } from "../stores/boards";

const OptionItem = ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: LucideIcon;
  onPress: () => void;
}) => {
  const Icon = icon
  return (
    <Pressable
      onPress={onPress}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
      }}
    >
      <Icon size={24} />
      <Text style={{ fontSize: 20 }}>{label}</Text>
    </Pressable>
  )
}

export default function PageOptions({
  ref,
  copyMessage,
}: {
  ref: React.RefObject<TrueSheet | null>;
  copyMessage?: () => void;
}) {
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
      backgroundColor="white"
      style={{ padding: 16 }}
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