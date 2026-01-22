import { Link } from "expo-router";
import { Settings } from "lucide-react-native";
import { Pressable } from "react-native";

export default function SettingsButton() {
  return (
    <Link href="/settings" asChild>
      <Pressable style={{ padding: 10 }}>
        <Settings size={24} color="black" />
      </Pressable>
    </Link>
  )
}