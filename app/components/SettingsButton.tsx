import { Link } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable, StyleProp, ViewStyle } from "react-native";

export default function SettingsButton({
  style,
}: {
  style?: StyleProp<ViewStyle>
}) {
  return (
    <Link href="/settings" asChild>
      <Pressable style={style}>
        <Settings size={24} color="black" />
      </Pressable>
    </Link>
  )
}