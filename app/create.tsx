import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, View } from "react-native"
import PageAdd from "./components/PageAdd"
import { usePagesetActions } from "./stores/boards"
import { generateNewBoard } from "./utils/boards"
import { saveBoard } from "./utils/file"
import { GAP, MAX_WIDTH, PADDING, useTheme } from "./utils/theme"
import { uuid } from "./utils/uuid"

export default function Create() {
  const theme = useTheme()
  const { addBoard, toggleEditMode } = usePagesetActions()
  const { replace } = useRouter()

  const createBoard = async (name: string, rows: number, cols: number) => {
    const id = uuid()
    const tree = generateNewBoard(rows, cols)
    const uri = `${id}.obz`
    await saveBoard(uri, tree)
    addBoard({ id, uri, name })
    toggleEditMode()
    replace(`/${id}`)
  }

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.surface,
          paddingBottom: 200,
        }}
      >
        <PageAdd onPress={createBoard} defaultName="New board" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: MAX_WIDTH,
    maxWidth: "100%",
    padding: PADDING.xl,
    marginHorizontal: "auto",
    gap: GAP.lg,
  },
})
