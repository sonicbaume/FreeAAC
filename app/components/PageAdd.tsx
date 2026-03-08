import { useState } from "react"
import { StyleSheet, TextInput, View } from "react-native"
import {
  colValues,
  defaultColValue,
  defaultRowValue,
  rowValues,
} from "../utils/consts"
import { GAP, MAX_WIDTH, PADDING, RADIUS, useTheme } from "../utils/theme"
import SheetPicker from "./SheetPicker"
import { Button, Text } from "./Styled"

export default function PageAdd({
  onPress,
}: {
  onPress: (name: string, rows: number, cols: number) => Promise<void>
}) {
  const theme = useTheme()
  const [rows, setRows] = useState(defaultRowValue)
  const [cols, setCols] = useState(defaultColValue)
  const [name, setName] = useState("New board")
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.surface,
        paddingBottom: 200,
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
          borderColor: theme.outline,
        }}
      />
      <View style={{ display: "flex", flexDirection: "row", gap: GAP.lg }}>
        <View style={{ flex: 1, gap: GAP.md }}>
          <Text>Rows</Text>
          <SheetPicker
            items={rowValues}
            value={rows}
            onChange={(item) => item.value && setRows(item.value)}
          />
        </View>
        <View style={{ flex: 1, gap: GAP.md }}>
          <Text>Cols</Text>
          <SheetPicker
            items={colValues}
            value={cols}
            onChange={(item) => item.value && setCols(item.value)}
          />
        </View>
      </View>
      <Button
        variant="primary"
        onPress={() => onPress(name, parseInt(rows), parseInt(cols))}
        style={{ marginTop: GAP.lg }}
      >
        <Text style={{ color: theme.onPrimary }}>Create</Text>
      </Button>
    </View>
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
  textInput: {
    borderRadius: RADIUS.md,
    // borderWidth: 1,
    padding: PADDING.lg,
  },
})
