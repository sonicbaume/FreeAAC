import { AACButton } from "@willwade/aac-processors/browser";
import { Delete, Home, Menu, X } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useMessageButtonsIds, usePagesetActions } from "../stores/pagesets";
import { speak } from "../utils/speech";

export default function MessageWindow({
  onNavigateHome,
  onOpenSettings,
  buttons,
}: {
  onNavigateHome: () => void;
  onOpenSettings: () => void;
  buttons: AACButton[];
}) {
  const messageButtonsIds = useMessageButtonsIds();
  const { removeLastMessageButtonId, clearMessageButtonIds } = usePagesetActions();
  const messageButtons = messageButtonsIds
    .map(id => buttons.find(b => b.id === id))
    .filter(b => b !== undefined)
  const message =  messageButtons.map(b => b.message).join(' ')
  
  return (
    <View style={{
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: 'white',
    }}>
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={onNavigateHome}
        >
          <Home size={30} />
        </Pressable>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#eee' }}>
        <Pressable
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}
          onPress={() => speak(message)}
        >
          {messageButtons.map((button, i) => (
            <Image
              key={i}
              source={{ uri: button.image }}
              resizeMode="contain"
              style={{ width: 60, height: 60 }}
            />
          ))}
        </Pressable>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
          {messageButtonsIds.length > 0 && <>
            <Pressable
              style={styles.button}
              onPress={removeLastMessageButtonId}
              disabled={messageButtonsIds.length === 0}
            >
              <Delete size={30} />
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={clearMessageButtonIds}
              disabled={messageButtonsIds.length === 0}
            >
              <X size={30} />
            </Pressable>
          </>}
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={onOpenSettings}
        >
          <Menu size={30} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5
  }
})