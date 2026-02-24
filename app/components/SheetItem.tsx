import { LucideIcon } from "lucide-react-native";
import { FONT_SIZE, GAP, ICON_SIZE, PADDING, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function SheetItem ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: LucideIcon;
  onPress: () => void;
}) {
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
      {Icon && <Icon size={ICON_SIZE.lg} color={theme.onSurface} />}
      <Text style={{ fontSize: FONT_SIZE.xl }}>{label}</Text>
    </Button>
  )
}