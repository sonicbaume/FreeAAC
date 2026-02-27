import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import SheetPicker from "./components/SheetPicker";
import { Button, Text } from "./components/Styled";
import { usePagesetActions } from "./stores/boards";
import { generateNewBoard } from "./utils/boards";
import { colValues, defaultColValue, defaultRowValue, rowValues } from "./utils/consts";
import { saveBoard } from "./utils/file";
import { GAP, MAX_WIDTH, PADDING, RADIUS, useTheme } from "./utils/theme";
import { uuid } from "./utils/uuid";

export default function Create () {
  const theme = useTheme()
  const { addBoard, toggleEditMode } = usePagesetActions()
  const { replace } = useRouter()
  const [rows, setRows] = useState(defaultRowValue)
  const [cols, setCols] = useState(defaultColValue)
  const [name, setName] = useState("New board")

  const createBoard = async () => {
    const id = uuid()
    const tree = generateNewBoard(parseInt(rows), parseInt(cols))
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
          paddingBottom: 200
        }}
      >
        <Text>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={{
            ...styles.textInput,
            backgroundColor: theme.surfaceContainer,
            color: theme.onSurface,
            borderColor: theme.outline
          }}
        />
        <View style={{ display: 'flex', flexDirection: 'row', gap: GAP.lg }}>
          <View style={{ flex: 1, gap: GAP.md }}>
            <Text>Rows</Text>
            <SheetPicker
              items={rowValues}
              value={rows}
              onChange={item => item.value && setRows(item.value)}
            />
          </View>
          <View style={{ flex: 1, gap: GAP.md }}>
            <Text>Cols</Text>
            <SheetPicker
              items={colValues}
              value={cols}
              onChange={item => item.value && setCols(item.value)}
            />
          </View>
        </View>
        <Button variant="primary" onPress={createBoard} style={{ marginTop: GAP.lg }}>
          <Text style={{ color: theme.onPrimary }}>Create</Text>
        </Button> 
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: MAX_WIDTH,
    maxWidth: '100%',
    padding: PADDING.xl,
    marginHorizontal: 'auto',
    gap: GAP.lg
  },
  textInput: {
    borderRadius: RADIUS.md,
    // borderWidth: 1,
    padding: PADDING.lg,
  }
})
