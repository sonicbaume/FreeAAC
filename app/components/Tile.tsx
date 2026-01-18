import { AACButton } from "@willwade/aac-processors/browser"
import { Pressable, StyleSheet, Text } from "react-native"
import { speak } from "../utils/speech"

export default function Tile({
  button,
}: {
  button: AACButton
}) {

  const handlePress = () => {
    if (button.action?.type === "SPEAK") {
      speak(button.action.message ?? button.message)
    }
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={styles.label}>{button.label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 30
  }
})