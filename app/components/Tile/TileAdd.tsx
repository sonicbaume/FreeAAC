import { Plus } from "lucide-react-native"
import { Pressable, StyleSheet } from "react-native"
import { ICON_SIZE, RADIUS, useTheme } from "../../utils/theme"

export default function TileAdd({ onPress }: { onPress: () => void }) {
  const theme = useTheme()
  return (
    <Pressable
      style={{ ...styles.tile, borderColor: theme.outline }}
      onPress={onPress}
    >
      <Plus size={ICON_SIZE.xl} color={theme.onSurface} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: RADIUS.xl,
  },
})
