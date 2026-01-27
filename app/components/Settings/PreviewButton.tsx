import { LucideIcon, Volume2 } from "lucide-react-native";
import { Pressable } from "react-native";

export default function PreviewButton ({
  onPress,
  disabled,
  icon = Volume2
}: {
  onPress: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  const Icon = icon
  return (<Pressable
    disabled={disabled}
    onPress={onPress}
  >
    <Icon size={24} color={disabled ? "lightgrey" : "darkgrey"} />
  </Pressable>)
}