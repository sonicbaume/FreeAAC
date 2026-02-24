import { AACButton, AACStyle } from "@willwade/aac-processors/browser"
import { StyleSheet, View } from "react-native"
import Sortable from "react-native-sortables"
import { useButtonView, useLabelLocation } from "../stores/prefs"
import { PADDING, RADIUS } from "../utils/theme"
import { BoardButton } from "../utils/types"
import { Text } from "./Styled"
import TileImage from "./TileImage"

const Label = ({
  text,
  style,
}: {
  text: string;
  style?: AACStyle;
}) => {
  return (
    <Text style={{
      ...styles.label,
      color: style?.fontColor,
      fontSize: style?.fontSize,
    }}>
      {text}
    </Text>
  )
}
export default function Tile({
  button,
  onPress,
  height,
  index,
}: {
  button: BoardButton;
  onPress: (button: AACButton, index: number) => void;
  height: number;
  index: number;
}) {
  const labelLocation = useLabelLocation()
  const buttonView = useButtonView()

  const showText = buttonView === "both" || buttonView === "text"
  const showSymbol = buttonView === "both" || buttonView === "symbol"
  const isLink = button.semanticAction?.targetId !== undefined
  const labelJustify = buttonView === "text" ? "center" :
    labelLocation === "bottom" ? "flex-end" :
    "flex-start"

  return (
    <View style={{ height }}>
      <Sortable.Touchable
        onTap={() => onPress(button, index)}
        style={{
          ...styles.container,
          ...button.style,
          height,
          borderTopRightRadius: isLink ? 50 : undefined,
          justifyContent: labelJustify
        }}
      >
        {showText && labelLocation === "top" && <Label text={button.label} style={button.style} />}
        {showSymbol && button.image && <TileImage uri={button.image} style={styles.symbol} />}
        {showText && labelLocation === "bottom" && <Label text={button.label} style={button.style} />}
      </Sortable.Touchable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderRadius: RADIUS.lg,
    cursor: 'pointer',
    borderWidth: 2,
  },
  label: {
    paddingVertical: PADDING.sm,
    textAlign: 'center',
    flexShrink: 1
  },
  symbol: {
    flex: 1,
    pointerEvents: 'none'
  },
})