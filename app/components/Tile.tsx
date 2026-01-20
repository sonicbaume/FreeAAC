import { AACButton } from "@willwade/aac-processors/browser"
import { SquareArrowOutUpRight } from "lucide-react-native"
import { Image, Pressable, StyleSheet, Text } from "react-native"
import { usePagesetActions } from "../stores/pagesets"
import { useLabelLocation, usePlayOnPress } from "../stores/prefs"
import { fixSvgData } from "../utils/file"
import { speak } from "../utils/speech"

const Label = ({ text }: { text: string }) => {
  return (
    <Text
      style={styles.label}
    >
      {text}
    </Text>
  )
}
export default function Tile({
  button,
}: {
  button: AACButton
}) {
  const playOnPress = usePlayOnPress()
  const labelLocation = useLabelLocation()
  const { setCurrentPageId, addMessageButtonId } = usePagesetActions()
  
  const handlePress = () => {
    if (button.action?.type === "SPEAK") {
      if (playOnPress) speak(button.action.message ?? button.message)
      addMessageButtonId(button.id)
    } else if (button.action?.type === "NAVIGATE" && button.action.targetPageId) {
      setCurrentPageId(button.action.targetPageId)
    }
  }

  return (
    <Pressable
      style={{
        ...styles.container,
        ...button.style,
      }}
      onPress={handlePress}
    >
      {labelLocation === "top" && <Label text={button.label} />}
      {button.image &&
      <Image
        source={{
          uri: fixSvgData(button.image)
        }}
        resizeMode="contain"
        style={styles.symbol}
      />
      }
      {labelLocation === "bottom" && <Label text={button.label} />}
      {button.action?.type === "NAVIGATE" &&
      <SquareArrowOutUpRight
        style={{ position: 'absolute', top: 8, right: 8}}
        size={18}
      />
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10
  },
  label: {
    paddingVertical: 5,
    textAlign: 'center',
  },
  symbol: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
})