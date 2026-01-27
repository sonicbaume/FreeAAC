import { AACButton } from "@willwade/aac-processors/browser";
import * as Clipboard from 'expo-clipboard';
import { ClipboardCheck, Copy, Delete, Home, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSpeak } from "../stores/audio";
import { useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useClearMessageOnPlay, useShowShareButton } from "../stores/prefs";
import TileImage from "./TileImage";

export default function MessageWindow({
  navigateHome,
  buttons,
}: {
  navigateHome: () => void;
  buttons: AACButton[];
}) {
  const [copied, setCopied] = useState(false)
  const messageScrollView = useRef<ScrollView>(null)
  const messageButtonsIds = useMessageButtonsIds()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const showShareButton = useShowShareButton()
  const { removeLastMessageButtonId, clearMessageButtonIds } = usePagesetActions()
  const speak = useSpeak()

  const messageButtons = messageButtonsIds
    .map(id => buttons.find(b => b.id === id))
    .filter(b => b !== undefined)
  const message =  messageButtons.map(b => b.message).join(' ')

  const copyMessage = async () => {
    const success = await Clipboard.setStringAsync(message)
    if (success) setCopied(true)
  }
  useEffect(() => setCopied(false), [message])

  const playMessage = () => speak(message, {
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
            {showShareButton &&
            <Pressable
              style={styles.button}
              onPress={copyMessage}
              disabled={messageButtonsIds.length === 0}
            >
              {copied ? <ClipboardCheck size={30} color="green" /> : <Copy size={30} />}
            </Pressable>
            }
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