import { useRouter } from "expo-router"
import { FlatList } from "react-native"
import { useBoards } from "../stores/boards"
import { FONT_SIZE, GAP, useTheme } from "../utils/theme"
import { Button, Text } from "./Styled"

export default function BoardList() {
  const theme = useTheme()
  const boards = useBoards()
  const router = useRouter()
  return (
    <FlatList
      contentContainerStyle={{ gap: GAP.xs}}
      data={boards}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Button
          variant="ghost"
          onPress={() => {
            router.push({
              pathname: '/[board]',
              params: { board: item.id }
            })
          }}
        >
          <Text style={{ color: theme.onSurface, fontSize: FONT_SIZE.lg }}>{item.name}</Text>
        </Button>
      )}
    />
  )
}