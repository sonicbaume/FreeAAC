import { ReactNode } from "react";
import { FONT_SIZE, GAP, PADDING, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function SheetItem ({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: ReactNode;
  onPress: () => void;
}) {
  const theme = useTheme()
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
      {icon}
      <Text
        style={{
          fontSize: FONT_SIZE.xl,
          color: theme.onSurface
        }}
      >{label}</Text>
    </Button>
  )
}