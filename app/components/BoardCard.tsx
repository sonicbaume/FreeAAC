import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { BoardTemplate, licenseImageMap } from "../utils/consts";
import { FONT_SIZE, GAP, MAX_WIDTH, PADDING, RADIUS, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function BoardCard ({
  board,
  onSelect,
}: {
  board: BoardTemplate;
  onSelect: () => void;
}) {
  const theme = useTheme()
  const [assets, error] = useAssets([licenseImageMap.light[board.license]])
  const sizeMB = Math.max(board.size / 1024 / 1024, 1).toFixed(0)
  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceContainer }]}>
      <View style={{ padding: PADDING.lg, gap: GAP.md}}>
        <Text style={{ fontSize: FONT_SIZE.xl }}>{board.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{ fontSize: FONT_SIZE.sm }}>{board.author}</Text>
          {assets && <Image source={assets[0]} style={{ aspectRatio: 82/31, width: 50 }} />}
        </View>
        <Text style={{ fontSize: FONT_SIZE.xs }} numberOfLines={5}>{board.description}</Text>
      </View>
      <Button onPress={onSelect} variant="primary">
        <Text style={{ color: theme.onPrimary }}>Install ({sizeMB}MB)</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
    width: MAX_WIDTH/2,
    maxWidth: '90%',
    aspectRatio: 1.3,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  }
})