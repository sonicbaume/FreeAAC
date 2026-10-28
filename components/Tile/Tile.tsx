import { useEditMode } from "@/stores/boards"
import { useButtonView, useLabelLocation } from "@/stores/prefs"
import { useDebounce } from "@/utils/debounce"
import { PADDING, RADIUS, useTheme } from "@/utils/theme"
import { BoardButton } from "@/utils/types"
import { AACButton, AACStyle } from "@willwade/aac-processors/browser"
import { StyleSheet, View } from "react-native"
import { Pressable } from "react-native-gesture-handler"
import { Text } from "../Styled"
import TileAdd from "./TileAdd"
import TileImage from "./TileImage"

const Label = ({ text, style }: { text: string; style?: AACStyle }) => {
  const theme = useTheme()
  const color =
    style?.fontColor ? style?.fontColor
    : style?.backgroundColor ? "#000"
    : theme.onSurface
  return (
    <Text
      style={{
        ...styles.label,
        color,
        fontSize: style?.fontSize,
      }}
    >
      {text}
    </Text>
  )
}
export default function Tile({
  button,
  onPress,
  index,
  onAdd,
}: {
  button: BoardButton | null
  onPress: (button: AACButton, index: number) => void
  index: number
  onAdd: () => void
}) {
  const debounce = useDebounce()
  const labelLocation = useLabelLocation()
  const buttonView = useButtonView()
  const editMode = useEditMode()

  const showText = buttonView === "both" || buttonView === "text"
  const showSymbol = buttonView === "both" || buttonView === "symbol"
  const isHidden = button?.visibility === "Hidden"
  const isLink = button?.semanticAction?.targetId !== undefined
  const labelJustify =
    buttonView === "text" ? "center"
    : labelLocation === "bottom" ? "flex-end"
    : "flex-start"

  const handlePress = () => {
    debounce(() => button && onPress(button, index))
  }

  if (button === null && editMode) return <TileAdd onPress={onAdd} />

  if (button === null) return <View style={{ flex: 1 }} />
  return (
    <Pressable
      onPress={handlePress}
      style={{
        ...styles.container,
        ...button.style,
        borderTopRightRadius: isLink ? 50 : undefined,
        justifyContent: labelJustify,
        borderStyle: isHidden ? "dashed" : "solid",
      }}
    >
      {showText && labelLocation === "top" && (
        <Label text={button.label} style={button.style} />
      )}
      {showSymbol && button.image && (
        <TileImage uri={button.image} style={styles.symbol} />
      )}
      {showText && labelLocation === "bottom" && (
        <Label text={button.label} style={button.style} />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
    borderRadius: RADIUS.lg,
    cursor: "pointer",
    borderWidth: 2,
  },
  label: {
    paddingVertical: PADDING.sm,
    textAlign: "center",
    flexShrink: 1,
  },
  symbol: {
    flex: 1,
    pointerEvents: "none",
  },
})
