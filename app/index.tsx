import { Link, useRouter } from "expo-router"
import {
  FilePlusCorner,
  PackageOpen,
  SquareArrowRightEnter,
} from "lucide-react-native"
import { useTransition } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import BoardList from "../components/Board/BoardList"
import { Button, Text } from "../components/Styled"
import { usePagesetActions } from "../stores/boards"
import { handleError } from "../utils/error"
import { importBoardFile } from "../utils/file"
import {
  FONT_SIZE,
  FONT_WEIGHT,
  GAP,
  ICON_SIZE,
  MAX_WIDTH,
  PADDING,
  useTheme,
} from "../utils/theme"

export default function Index() {
  const theme = useTheme()
  const router = useRouter()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  const openFile = async () => {
    try {
      startLoading(async () => {
        const board = await importBoardFile()
        if (!board) return
        addBoard(board)
        router.push({ pathname: "/[boardId]", params: { boardId: board.id } })
      })
    } catch (e) {
      handleError(e)
    }
  }

  return (
    <View style={{ ...styles.container }}>
      <ScrollView>
        <Text
          style={{
            fontSize: FONT_SIZE.md,
            fontWeight: FONT_WEIGHT.semi,
            paddingBottom: PADDING.xl,
          }}
        >
          My boards
        </Text>
        <BoardList />
        {loading && <ActivityIndicator size="large" color={theme.onSurface} />}
      </ScrollView>
      {!loading && (
        <View style={{ gap: GAP.md }}>
          <Button variant="outline" onPress={() => router.push("/templates")}>
            <PackageOpen size={ICON_SIZE.md} color={theme.onSurface} />
            <Text style={{ color: theme.onSurface }}>View templates</Text>
          </Button>
          <Link href="/create" asChild>
            <Button variant="outline">
              <FilePlusCorner size={ICON_SIZE.md} color={theme.onSurface} />
              <Text>Create board</Text>
            </Button>
          </Link>
          <Button variant="outline" onPress={openFile}>
            <SquareArrowRightEnter
              size={ICON_SIZE.md}
              color={theme.onSurface}
            />
            <Text>Import board</Text>
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: "auto",
    width: "100%",
    maxWidth: MAX_WIDTH,
    padding: PADDING.xl,
  },
})
