import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useRouter } from "expo-router"
import { Ellipsis } from "lucide-react-native"
import { useRef, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { useBoards } from "../stores/boards"
import { FONT_SIZE, GAP, ICON_SIZE, useTheme } from "../utils/theme"
import BoardOptions from "./BoardOptions"
import { Button, Text } from "./Styled"

export default function BoardList() {
  const sheetRef = useRef<TrueSheet>(null)
  const theme = useTheme()
  const boards = useBoards()
  const router = useRouter()
  const [selectedBoardId, setSelectedBoardId] = useState<string>()
  return <>
    {boards.length > 0 &&
    <FlatList
      contentContainerStyle={{ gap: GAP.xs}}
      data={boards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.container}>
          <Button
            variant="ghost"
            style={{ justifyContent: 'flex-start', flex: 1 }}
            onPress={() => {
              router.push({
                pathname: '/[board]',
                params: { board: item.id }
              })
            }}
          >
            <Text style={{ color: theme.onSurface, fontSize: FONT_SIZE.lg }}>{item.name}</Text>
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
      )}
    />
    }
    {boards.length === 0 &&
    <Text style={{ textAlign: 'center' }}>No boards found</Text>
    }
    <BoardOptions ref={sheetRef} boardId={selectedBoardId} />
  </>
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})