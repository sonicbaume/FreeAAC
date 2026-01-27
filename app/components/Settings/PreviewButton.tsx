import { useTtsStatus } from "@/app/stores/audio";
import { useSpeechOptions } from "@/app/stores/prefs";
import { LucideIcon, Volume2 } from "lucide-react-native";
import { Pressable } from "react-native";

export default function PreviewButton ({
  onPress,
  icon = Volume2
}: {
  onPress: () => void;
  icon?: LucideIcon;
}) {
  const speechOptions = useSpeechOptions()
  const ttsStatus = useTtsStatus()
  const canPreview = (speechOptions.engine === "kokoro" && ttsStatus.isReady) || speechOptions.engine === "device"

  const Icon = icon
  return (<Pressable
    disabled={!canPreview}
    onPress={onPress}
  >
    <Icon size={24} color={canPreview ? "darkgrey" : "lightgrey"} />
  </Pressable>)
}