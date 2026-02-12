import { Check } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BoardButton } from "../utils/types";
import ColorPicker from "./ColorPicker";

export default function TileEditor({
  button,
  setButton,
  hideSheet
}: {
  button: BoardButton | undefined;
  setButton: (button: BoardButton) => void;
  hideSheet: () => void;
}) {
  if (!button) return <></>
  return <>
    <ScrollView nestedScrollEnabled style={{ width: '100%', padding: 30 }}>
      <View style={styles.labelContainer}>
        <TextInput
          value={button.label}
          onChangeText={label => setButton({...button, label})}
          style={styles.input}
        />
        <Pressable onPress={hideSheet}>
          <Check size={30} />
        </Pressable>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Message</Text>
        <TextInput value={button.message} />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.colorLabel}>Background</Text>
        <ColorPicker
          color={button.style?.backgroundColor}
          onChange={(backgroundColor) => setButton({
            ...button,
            style: {
              ...button.style,
              backgroundColor
            }
          })} />
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.colorLabel}>Border</Text>
        <ColorPicker
          color={button.style?.borderColor}
          onChange={(borderColor) => setButton({
            ...button,
            style: {
              ...button.style,
              borderColor
            }
          })} />
      </View>
    </ScrollView>
    </>
}

const styles = StyleSheet.create({
  label: {
    padding: 5,
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  colorLabel: {
    fontSize: 16,
    width: '20%',
    textAlign: 'right',
  }
})