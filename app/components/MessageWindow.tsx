import { AACButton } from "@willwade/aac-processors/browser";
import { Delete, Home, X } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useClearMessageOnPlay, useSpeechOptions } from "../stores/prefs";
import { fixSvgData } from "../utils/file";
import { speak } from "../utils/speech";

export default function MessageWindow({
  navigateHome,
  buttons,
}: {
  navigateHome: () => void;
  buttons: AACButton[];
}) {
  const speechOptions = useSpeechOptions()
  const messageButtonsIds = useMessageButtonsIds()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const { removeLastMessageButtonId, clearMessageButtonIds } = usePagesetActions()
  const messageButtons = messageButtonsIds
    .map(id => buttons.find(b => b.id === id))
    .filter(b => b !== undefined)
  const message =  messageButtons.map(b => b.message).join(' ')

  const playMessage = () => speak(message, {
    ...speechOptions,
    onDone: () => {
      if (clearMessageOnPlay) clearMessageButtonIds()
    }
  })
  
  return (
    <View style={{
      height: 60,
      flexDirection: "row",
      backgroundColor: 'white',
    }}>
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={navigateHome}
        >
          <Home size={30} />
        </Pressable>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#eee' }}>
        <Pressable
          style={{ flex: 1, flexDirection: 'row-reverse', justifyContent: 'flex-start', overflowX: 'scroll' }}
          onPress={playMessage}
          disabled={messageButtons.length === 0}
        >
          <View style={{ display: 'flex', flexDirection: 'row', minWidth: '100%'}}>
          {messageButtons.map((button, i) => (
            <Image
              key={i}
              source={{ uri: fixSvgData(button.image) }}
              resizeMode="contain"
              style={{ width: 60, height: 60 }}
            />
          ))}
          </View>
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
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5
  }
})