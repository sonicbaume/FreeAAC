import { AACButton } from "@willwade/aac-processors/browser"
import { Pressable, StyleSheet, Text } from "react-native"

export default function Tile({
  button,
}: {
  button: AACButton
}) {
  return (
    <Pressable style={styles.container}>
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