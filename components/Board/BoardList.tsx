import { handleError } from "@/utils/error"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useRouter } from "expo-router"
import { Ellipsis } from "lucide-react-native"
import { useRef, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"
import { useBoards, useBoardsLoaded } from "../../stores/boards"
import { FONT_SIZE, GAP, ICON_SIZE, useTheme } from "../../utils/theme"
import { Button, Text } from "../Styled"
import BoardOptions from "./BoardOptions"

export default function BoardList() {
  const sheetRef = useRef<TrueSheet>(null)
  const theme = useTheme()
  const boardsLoaded = useBoardsLoaded()
  const boards = useBoards()
  const router = useRouter()
  const [selectedBoardId, setSelectedBoardId] = useState<string>()
  return (
    <View style={{ gap: GAP.md }}>
      {boardsLoaded &&
        boards.length > 0 &&
        boards.map((item) => (
          <View style={styles.container} key={item.id}>
            <Button
              variant="ghost"
              style={{ justifyContent: "flex-start", flex: 1 }}
              onPress={() => {
                const rootPage = boards.find(
                  (board) => board.id === item.id,
                )?.rootPage
                if (!rootPage) return handleError("Root page not found")
                router.push({
                  pathname: "/[boardId]/[pageId]",
                  params: { boardId: item.id, pageId: rootPage },
                })
              }}
            >
              <Text style={{ color: theme.onSurface, fontSize: FONT_SIZE.lg }}>
                {item.name}
              </Text>
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                setSelectedBoardId(item.id)
                sheetRef.current?.present()
              }}
            >
              <Ellipsis size={ICON_SIZE.md} color={theme.outline} />
            </Button>
          </View>
        ))}
      {boardsLoaded && boards.length === 0 && (
        <Text style={{ textAlign: "center" }}>No boards found</Text>
      )}
      {!boardsLoaded && (
        <ActivityIndicator size="large" color={theme.outline} />
      )}
      <BoardOptions ref={sheetRef} boardId={selectedBoardId} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
})
