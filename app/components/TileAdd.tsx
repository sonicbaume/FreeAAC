import { Plus } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";
import { ICON_SIZE, RADIUS, useTheme } from "../utils/theme";

export default function TileAdd({
  onPress,
  height
}: {
  onPress: () => void;
  height: number;
}) {
  const theme = useTheme()
  return (
    <Pressable
      style={{ ...styles.tile, height, borderColor: theme.outline }}
      onPress={onPress}
    >
      <Plus size={ICON_SIZE.xl} color={theme.onSurface} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: RADIUS.xl,
  }
})