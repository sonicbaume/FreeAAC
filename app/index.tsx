
import { Link, useRouter } from "expo-router";
import { FilePlusCorner, Import, PackageOpen } from "lucide-react-native";
import { useTransition } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BoardList from "./components/BoardList";
import { Button, Text } from "./components/Styled";
import { usePagesetActions } from "./stores/boards";
import { handleError } from "./utils/error";
import { loadBoard, selectFile } from "./utils/file";
import { FONT_SIZE, FONT_WEIGHT, GAP, ICON_SIZE, MAX_WIDTH, PADDING, useTheme } from "./utils/theme";

export default function Index() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  const openFile = async () => {
    try {
      const file = await selectFile()
      if (!file) return
      startLoading(async () => {
        const tree = await loadBoard(file.uri)
        addBoard({
          id: file.id,
          uri: file.uri,
          name: tree.metadata.name || 'Untitled board',
        })
        router.push({ pathname: '/[board]', params: { board: file.id } })
      })
    } catch (e) {
      handleError(e)
    }
  }

  return <>
    <View style={{
      ...styles.container,
      backgroundColor: theme.background,
      paddingBottom: insets.bottom
    }}>
      <View style={{...styles.boardList, backgroundColor: theme.surface}}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={{ fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semi }}>My boards</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Link href="/create" asChild>
              <Button variant="ghost">
                <FilePlusCorner size={ICON_SIZE.md} color={theme.onSurface} />
              </Button>
            </Link>
            <Button variant="ghost" onPress={openFile}>
              <Import size={ICON_SIZE.md} color={theme.onSurface} />
            </Button>
          </View>
        </View>
        <BoardList />
        {loading && <ActivityIndicator size="large" color={theme.onSurface} />}
        {!loading && <>
          <Button variant="outline" onPress={() => router.push("/templates")}>
            <PackageOpen size={ICON_SIZE.md} color={theme.onSurface} />
            <Text style={{ color: theme.onSurface}}>View templates</Text>
          </Button>
        </>}
      </View>
    </View>
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boardList: {
    width: MAX_WIDTH,
    maxWidth: '100%',
    padding: PADDING.xl,
    gap: GAP.xl,
  }
})