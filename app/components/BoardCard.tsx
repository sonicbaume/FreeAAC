import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Button, StyleSheet, Text, View } from "react-native";
import { BoardTemplate, licenseImageMap } from "../utils/consts";

export default function BoardCard ({
  board,
  onSelect,
}: {
  board: BoardTemplate;
  onSelect: () => void;
}) {
  const [assets, error] = useAssets([licenseImageMap.light[board.license]])
  const sizeMB = Math.max(board.size / 1024 / 1024, 1).toFixed(0)
  return (
    <View style={styles.card}>
      <View style={{ padding: 10, gap: 5}}>
        <Text style={{ fontSize: 20 }}>{board.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: 14 }}>{board.author}</Text>
          {assets && <Image source={assets[0]} style={{ aspectRatio: 82/31, width: 50 }} />}
        </View>
        <Text style={{ fontSize: 12 }} numberOfLines={5}>{board.description}</Text>
      </View>
      <Button title={`Install (${sizeMB}MB)`} onPress={onSelect} />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
    width: 300,
    maxWidth: '90%',
    aspectRatio: 1.3,
    borderRadius: 20,
    overflow: 'hidden',
  }
})