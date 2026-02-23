import { ICON_SIZE, useTheme } from "@/app/utils/theme";
import { Link } from "expo-router";
import { Settings } from "lucide-react-native";
import { Button } from "../Styled";

export default function SettingsButton() {
  const theme = useTheme()
  return (
    <Link href="/settings" asChild>
      <Button>
        <Settings size={ICON_SIZE.lg} color={theme.onSecondary} />
      </Button>
    </Link>
  )
}