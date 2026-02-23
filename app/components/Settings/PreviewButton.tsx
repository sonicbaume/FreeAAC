import { useTtsStatus } from "@/app/stores/audio";
import { useSpeechOptions } from "@/app/stores/prefs";
import { ICON_SIZE, useTheme } from "@/app/utils/theme";
import { LucideIcon, Volume2 } from "lucide-react-native";
import { Button } from "../Styled";

export default function PreviewButton ({
  onPress,
  icon = Volume2
}: {
  onPress: () => void;
  icon?: LucideIcon;
}) {
  const theme = useTheme()
  const speechOptions = useSpeechOptions()
  const ttsStatus = useTtsStatus()
  const canPreview = (speechOptions.engine === "kokoro" && ttsStatus.isReady) || speechOptions.engine === "device"

  const Icon = icon
  return (
    <Button
      variant="secondary"
      disabled={!canPreview}
      onPress={onPress}
    >
      <Icon size={ICON_SIZE.md} color={theme.onSecondary} />
    </Button>
  )
}