import { AACButton } from "@willwade/aac-processors/browser"
import { Image, Pressable, StyleSheet, Text } from "react-native"
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
      >{button.label}</Text>
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