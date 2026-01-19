import { AACButton } from "@willwade/aac-processors/browser"
import { SquareArrowOutUpRight } from "lucide-react-native"
import { Image, Pressable, StyleSheet, Text } from "react-native"
import { usePagesetActions } from "../stores/pagesets"
import { usePlayOnPress } from "../stores/prefs"
import { speak } from "../utils/speech"

export default function Tile({
  button,
}: {
  button: AACButton
}) {
  const playOnPress = usePlayOnPress()
  const { setCurrentPageId } = usePagesetActions()

  const handlePress = () => {
    if (button.action?.type === "SPEAK") {
      if (playOnPress) speak(button.action.message ?? button.message)
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
      {button.image &&
      <Image
        source={{
          uri: button.image
        }}
        resizeMode="contain"
        style={styles.symbol}
      />
      }
      <Text
        style={styles.label}
      >
        {button.label}
      </Text>
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
    padding: 20
  },
  label: {
    // fontSize: 20,
  },
  symbol: {
    width: '100%',
    height: '100%',
  },
})