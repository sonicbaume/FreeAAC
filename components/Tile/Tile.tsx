import { useEditMode } from "@/stores/boards"
import { useButtonView, useLabelLocation } from "@/stores/prefs"
import { useDebounce } from "@/utils/debounce"
import { PADDING, RADIUS, useTheme } from "@/utils/theme"
import { BoardButton } from "@/utils/types"
import { UniqueIdentifier, useDraggable } from "@mgcrea/react-native-dnd"
import { AACButton, AACStyle } from "@willwade/aac-processors/browser"
import { StyleSheet, View } from "react-native"
import { Pressable } from "react-native-gesture-handler"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
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
  id,
  button,
  onPress,
  index,
  onAdd,
  width,
  height,
}: {
  id: UniqueIdentifier
  button: BoardButton | null
  onPress: (button: AACButton, index: number) => void
  index: number
  onAdd: () => void
  width?: number
  height?: number
}) {
  const debounce = useDebounce()
  const labelLocation = useLabelLocation()
  const buttonView = useButtonView()
  const editMode = useEditMode()

  const { props, offset, state, panGestureState } = useDraggable({
    id,
    disabled: !editMode,
  })

  const animatedStyle = useAnimatedStyle(() => {
    const isSleeping = state.value === "sleeping" // Should not animate if sleeping
    const isActive = state.value === "dragging"
    const isActing = state.value === "acting"
    const zIndex =
      isActive ? 999
      : isActing ? 998
      : 1
    const style = {
      opacity: isActive ? 0.9 : 1,
      zIndex,
      transform: [
        {
          translateX:
            isActive || isSleeping || isActing ?
              offset.x.value
            : withSpring(offset.x.value, { damping: 100, stiffness: 1000 }),
        },
        {
          translateY:
            isActive || isSleeping || isActing ?
              offset.y.value
            : withSpring(offset.y.value, { damping: 100, stiffness: 1000 }),
        },
      ],
    }
    return style
  }, [id, state])

  if (button === null && editMode) return <TileAdd onPress={onAdd} />
  if (button === null) return <View style={{ flex: 1 }} />

  const showText = buttonView === "both" || buttonView === "text"
  const showSymbol = buttonView === "both" || buttonView === "symbol"
  const isHidden = button.visibility === "Hidden"
  const isLink = button.semanticAction?.targetId !== undefined
  const labelJustify =
    buttonView === "text" ? "center"
    : labelLocation === "bottom" ? "flex-end"
    : "flex-start"

  const handlePress = () => {
    debounce(() => onPress(button, index))
  }

  return (
    <Animated.View {...props} style={[{ width, height }, animatedStyle]}>
      <Pressable
        onPressOut={() => {
          if (panGestureState.value !== 4) handlePress()
        }}
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
    </Animated.View>
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
