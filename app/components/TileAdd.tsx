import { Plus } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

export default function TileAdd({
  onPress,
  height
}: {
  onPress: () => void;
  height: number;
}) {
  return (
    <Pressable
      style={{ ...styles.tile, height  }}
      onPress={onPress}
    >
      <Plus size={40} />
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
    borderRadius: 20,
  }
})