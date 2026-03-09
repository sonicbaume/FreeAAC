import { useState } from "react"
import { TextInput, View } from "react-native"
import {
  colValues,
  defaultColValue,
  defaultRowValue,
  rowValues,
} from "../utils/consts"
import { GAP, PADDING, RADIUS, useTheme } from "../utils/theme"
import SheetPicker from "./SheetPicker"
import { Button, Text } from "./Styled"

export default function PageAdd({
  onPress,
  defaultName,
}: {
  onPress: (name: string, rows: number, cols: number) => Promise<void>
  defaultName: string
}) {
  const theme = useTheme()
  const [rows, setRows] = useState(defaultRowValue)
  const [cols, setCols] = useState(defaultColValue)
  const [name, setName] = useState(defaultName)
  return (
    <>
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{
          borderRadius: RADIUS.md,
          padding: PADDING.lg,
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
    </>
  )
}
