import { AACButton } from "@willwade/aac-processors/browser";
import { Delete, Home, X } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useOnEnd, useOnNext } from "../stores/audio";
import { useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useClearMessageOnPlay, useSpeechOptions } from "../stores/prefs";
import { useTtsModel } from "../stores/tts";
import { speak } from "../utils/speech";
import TileImage from "./TileImage";

export default function MessageWindow({
  navigateHome,
  buttons,
}: {
  navigateHome: () => void;
  buttons: AACButton[];
}) {
  const messageScrollView = useRef<ScrollView>(null)
  const speechOptions = useSpeechOptions()
  const messageButtonsIds = useMessageButtonsIds()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const { removeLastMessageButtonId, clearMessageButtonIds } = usePagesetActions()
  const ttsModel = useTtsModel()
  const onNext = useOnNext()
  const onEnd = useOnEnd()
  const messageButtons = messageButtonsIds
    .map(id => buttons.find(b => b.id === id))
    .filter(b => b !== undefined)
  const message =  messageButtons.map(b => b.message).join(' ')

  const playMessage = () => speak(message, {
    ...speechOptions,
    onDone: () => {
      if (clearMessageOnPlay) clearMessageButtonIds()
    }
  }, ttsModel, onNext, onEnd)
  
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
        <ScrollView
          ref={messageScrollView}
          horizontal={true}
          onContentSizeChange={() => messageScrollView.current?.scrollToEnd()}
          onTouchEnd={playMessage}
          onPointerUp={playMessage}
        >
          {messageButtons.map((button, i) => button.image && (
            <TileImage
              key={i}
              uri={button.image}
              style={{ width: 60, height: 60 }}
            />
          ))}
        </ScrollView>
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