import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Download } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BoardTemplate, licenseImageMap, licenseLinkMap } from "../utils/consts";

export default function BoardCard({
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
      <Image
        source={board.imageUrl}
        style={{ width: '100%', aspectRatio: 1.91, marginBottom: 5 }}
        contentFit="fill"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 20 }}>{board.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14 }}>{board.author}</Text>
          {assets && 
          <Link href={licenseLinkMap[board.license]} target="_blank" asChild>
            <Image source={assets[0]} style={{ aspectRatio: 82 / 31, width: 50 }} />
          </Link>}
        </View>
      </View>
      <Pressable onPress={onSelect} style={styles.button}>
        <Download size={20} color="white" />
        <Text style={styles.buttonText}>Install ({sizeMB}MB)</Text>
      </Pressable>
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
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 'auto'
  },
  button: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(33, 150, 243)',
    height: 32
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    verticalAlign: 'middle'
  },
})