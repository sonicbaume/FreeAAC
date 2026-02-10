import { ScrollView, Text, TextInput, View } from "react-native";
import { BoardButton } from "../utils/types";

export default function TileEditor({
  button,
  setButton,
}: {
  button: BoardButton | undefined;
  setButton: (button: BoardButton) => void;
}) {
  if (!button) return <></>
  return <>
    <ScrollView nestedScrollEnabled style={{ width: '100%', padding: 30 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Label</Text>
        <TextInput value={button.label} onChangeText={label => setButton({...button, label})} />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Message</Text>
        <TextInput value={button.message} />
      </View>
    </ScrollView>
    </>
}