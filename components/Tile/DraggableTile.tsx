import { useEditMode } from "@/stores/boards"
import { BoardButton } from "@/utils/types"
import { UniqueIdentifier, useDraggable } from "@mgcrea/react-native-dnd"
import { AACButton } from "@willwade/aac-processors/browser"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import Tile from "./Tile"

export default function DraggableTile({
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
  })

  return (
    <Animated.View {...props} style={[{ width, height }, animatedStyle]}>
      <Tile
        key={index}
        button={button}
        onPress={(button, index) => {
          if (panGestureState.value !== 4) onPress(button, index)
        }}
        index={index}
        onAdd={() => {
          if (panGestureState.value !== 4) onAdd()
        }}
      />
    </Animated.View>
  )
}
