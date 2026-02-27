import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SheetPicker from "./components/SheetPicker";
import { Button, Text } from "./components/Styled";
import { colValues, defaultColValue, defaultRowValue, rowValues } from "./utils/consts";
import { GAP, MAX_WIDTH, PADDING, useTheme } from "./utils/theme";

export default function Create () {
  const theme = useTheme()
  const [row, setRow] = useState(defaultRowValue)
  const [col, setCol] = useState(defaultColValue)

  const createBoard = () => {
    
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
        <View style={{ display: 'flex', flexDirection: 'row', gap: GAP.lg }}>
          <View style={{ flex: 1, gap: GAP.md }}>
            <Text>Rows</Text>
            <SheetPicker
              items={rowValues}
              value={row}
              onChange={item => item.value && setRow(item.value)}
            />
          </View>
          <View style={{ flex: 1, gap: GAP.md }}>
            <Text>Cols</Text>
            <SheetPicker
              items={colValues}
              value={col}
              onChange={item => item.value && setCol(item.value)}
            />
          </View>
        </View>
        <Button variant="primary" onPress={createBoard}>
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
  }
})
