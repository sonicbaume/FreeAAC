import { StyleSheet, Text, TextInput, View } from "react-native";
import { BoardButton } from "../utils/types";
import ColorPicker from "./ColorPicker";

export default function TileSettings ({
  button,
  setButton,
}: {
  button: BoardButton;
  setButton: (button: BoardButton) => void;
}) {
  return (
    <View style={{ display: 'flex', gap: 10, padding: 20  }}>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>Vocalization</Text>
        <TextInput
          value={button.message}
          onChangeText={message => setButton({...button, message})}
          placeholder={button.label}
          style={styles.input}
        />
      </View>
      <ColorPicker
      label="Background"
        color={button.style?.backgroundColor}
        onChange={(backgroundColor) => setButton({
          ...button,
          style: {
            ...button.style,
            backgroundColor
          }
        })}
      />
      <ColorPicker
        label="Border"
        color={button.style?.borderColor}
        onChange={(borderColor) => setButton({
          ...button,
          style: {
            ...button.style,
            borderColor
          }
        })}
      />
      <ColorPicker
        label="Text"
        color={button.style?.fontColor}
        onChange={(fontColor) => setButton({
          ...button,
          style: {
            ...button.style,
            fontColor
          }
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  }
})