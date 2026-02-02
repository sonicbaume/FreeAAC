import { AACButton } from "@willwade/aac-processors/browser"
import { StyleSheet, Text, View } from "react-native"
import Sortable from "react-native-sortables"
import { useSpeak } from "../stores/audio"
import { usePagesetActions } from "../stores/boards"
import { useButtonView, useGoHomeOnPress, useLabelLocation, usePlayOnPress } from "../stores/prefs"
import TileImage from "./TileImage"

const Label = ({ text }: { text: string }) => {
  return (
    <Text style={styles.label}>
      {text}
    </Text>
  )
}
export default function Tile({
  button,
  height,
  homePageId,
}: {
  button: AACButton;
  height: number;
  homePageId?: string;
}) {
  const playOnPress = usePlayOnPress()
  const labelLocation = useLabelLocation()
  const goHomeOnPress = useGoHomeOnPress()
  const buttonView = useButtonView()
  const { setCurrentPageId, addMessageButtonId } = usePagesetActions()
  const speak = useSpeak()

  const showText = buttonView === "both" || buttonView === "text"
  const showSymbol = buttonView === "both" || buttonView === "symbol"
  const isLink = button.action?.type === "NAVIGATE"
  
  const handlePress = () => {
    if (button.action?.type === "SPEAK") {
      if (playOnPress) speak(button.action.message ?? button.message)
      addMessageButtonId(button.id)
      if (goHomeOnPress && homePageId) setCurrentPageId(homePageId)
    } else if (button.action?.type === "NAVIGATE" && button.action.targetPageId) {
      setCurrentPageId(button.action.targetPageId)
    }
  }

  return (
    <View style={{ height }}>
      <Sortable.Touchable
        onTap={handlePress}
        style={{
          ...styles.container,
          ...button.style,
          height,
          borderTopRightRadius: isLink ? 50 : undefined
        }}
      >
        {showText && labelLocation === "top" && <Label text={button.label} />}
        {showSymbol && button.image && <TileImage uri={button.image} style={styles.symbol} />}
        {showText && labelLocation === "bottom" && <Label text={button.label} />}
      </Sortable.Touchable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    borderRadius: 10,
  },
  linkOverlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgb(242, 242, 242)',
    shadowColor: 'black',
    boxShadow: '#999 -1px 1px 5px'
  },
  label: {
    paddingVertical: 5,
    textAlign: 'center',
    flexShrink: 1
  },
  symbol: {
    flex: 1,
  },
})