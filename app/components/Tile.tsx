import { AACButton } from "@willwade/aac-processors/browser"
import { SquareArrowOutUpRight } from "lucide-react-native"
import { Pressable, StyleSheet, Text } from "react-native"
import { useSpeak } from "../stores/audio"
import { usePagesetActions } from "../stores/boards"
import { useButtonView, useGoHomeOnPress, useLabelLocation, usePlayOnPress, useSpeechOptions } from "../stores/prefs"
import { speak } from "../utils/speech"
import TileImage from "./TileImage"

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
  homePageId,
}: {
  button: AACButton;
  homePageId?: string;
}) {
  const speechOptions = useSpeechOptions()
  const playOnPress = usePlayOnPress()
  const labelLocation = useLabelLocation()
  const goHomeOnPress = useGoHomeOnPress()
  const buttonView = useButtonView()
  const { setCurrentPageId, addMessageButtonId } = usePagesetActions()
  const ttsSpeak = useSpeak()

  const showText = buttonView === "both" || buttonView === "text"
  const showSymbol = buttonView === "both" || buttonView === "symbol"
  
  const handlePress = () => {
    if (button.action?.type === "SPEAK") {
      if (playOnPress) speak(button.action.message ?? button.message, speechOptions, ttsSpeak)
      addMessageButtonId(button.id)
      if (goHomeOnPress && homePageId) setCurrentPageId(homePageId)
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
      {showText && labelLocation === "top" && <Label text={button.label} />}
      {showSymbol && button.image && <TileImage uri={button.image} style={styles.symbol} />}
      {showText && labelLocation === "bottom" && <Label text={button.label} />}
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