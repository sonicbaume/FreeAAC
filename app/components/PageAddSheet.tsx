import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { RefObject } from "react"
import { View } from "react-native"
import { FONT_SIZE, GAP, PADDING, useTheme } from "../utils/theme"
import PageAdd from "./PageAdd"
import { Text } from "./Styled"

export default function PageAddSheet({
  ref,
  onAdd,
}: {
  ref: RefObject<TrueSheet | null>
  onAdd: (name: string, rows: number, cols: number) => Promise<void>
}) {
  const theme = useTheme()
  return (
    <TrueSheet
      ref={ref}
      detents={["auto"]}
      backgroundColor={theme.surface}
      style={{ padding: PADDING.xl }}
    >
      <View style={{ padding: PADDING.xl, gap: GAP.lg }}>
        <Text style={{ fontSize: FONT_SIZE.lg, textAlign: "center" }}>
          Add page
        </Text>
        <PageAdd onPress={onAdd} />
      </View>
    </TrueSheet>
  )
}
