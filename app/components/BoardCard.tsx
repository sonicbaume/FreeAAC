import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { Download } from "lucide-react-native";
import { useTransition } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { usePagesetActions } from "../stores/boards";
import { BoardTemplate, licenseImageMap, licenseLinkMap } from "../utils/consts";
import { downloadFile } from "../utils/io";
import { FONT_SIZE, GAP, MAX_WIDTH, RADIUS, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function BoardCard({
  board,
}: {
  board: BoardTemplate;
}) {
  const theme = useTheme()
  const [assets, error] = useAssets([licenseImageMap.light[board.license]])
  const sizeMB = Math.max(board.size / 1024 / 1024, 1).toFixed(0)
  const [isLoading, startLoading] = useTransition()
  const { replace } = useRouter()
  const { addBoard } = usePagesetActions()

  const load = () => {
    startLoading(async () => {
      const { fileName, id } = await downloadFile(board.url)
      addBoard({ id, uri: fileName, name: board.name})
      replace({ pathname: '/[board]', params: { board: id } })
    })
  }

  return (
    <View style={{...styles.card, backgroundColor: theme.surfaceContainer}}>
      <Image
        source={board.imageUrl}
        style={{ width: '100%', aspectRatio: 1.91, marginBottom: GAP.xs }}
        contentFit="fill"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: FONT_SIZE.xl, color: theme.onSurface }}>{board.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: FONT_SIZE.sm, color: theme.onSurface }}>{board.author}</Text>
          {assets && 
          <Link href={licenseLinkMap[board.license]} target="_blank" asChild>
            <Image source={assets[0]} style={{ aspectRatio: 82 / 31, width: 50 }} />
          </Link>}
        </View>
      </View>
      <Button
        variant="primary"
        onPress={load}
        disabled={isLoading}
        style={{ borderRadius: 0 }}
      >
        {!isLoading && <>
          <Download size={20} color={theme.onPrimary} />
          <Text style={{ color: theme.onPrimary }}>Install ({sizeMB}MB)</Text>
        </>}
        {isLoading && <>
          <ActivityIndicator size="small" color={theme.onPrimary} />
          <Text style={{ color: theme.onPrimary }}>Installing...</Text>
        </>}
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: MAX_WIDTH/2,
    maxWidth: '90%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginHorizontal: 'auto'
  },
})