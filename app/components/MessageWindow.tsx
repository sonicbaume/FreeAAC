import { AACButton } from "@willwade/aac-processors/browser";
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { ClipboardCheck, Copy, Delete, EllipsisVertical, Fullscreen, Home, Layers, Settings, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSpeak } from "../stores/audio";
import { useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useButtonView, useClearMessageOnPlay, useLabelLocation, useShowBackspace, useShowShareButton } from "../stores/prefs";
import TileImage from "./TileImage";

export default function MessageWindow({
  navigateHome,
  buttons,
  isHome,
}: {
  navigateHome: () => void;
  buttons: AACButton[];
  isHome: boolean;
}) {
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const scrollView = useRef<ScrollView>(null)
  const messageButtonsIds = useMessageButtonsIds()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const showShareButton = useShowShareButton()
  const showBackspace = useShowBackspace()
  const buttonView = useButtonView()
  const labelLocation = useLabelLocation()
  const { removeLastMessageButtonId, clearMessageButtonIds } = usePagesetActions()
  const speak = useSpeak()
  const { replace, push } = useRouter()

  const showSymbols = buttonView === "both" || buttonView === "symbol"
  const showText = buttonView === "both" || buttonView === "text"

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

  const handleHomePress = () => {
    if (isHome) replace('/')
    else navigateHome()
  }

  const requestFullscreen = () => {
    if (Platform.OS !== "web") return
    const element = document.documentElement
    if (element.requestFullscreen) element.requestFullscreen()
    setShowModal(false)
  }

  return <>
    <View style={{
      height: 60,
      flexDirection: "row",
      backgroundColor: 'white',
    }}>
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={handleHomePress}
        >
          {!isHome && <Home size={30} />}
          {isHome && <Layers size={30} />}
        </Pressable>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#eee' }}>
        <ScrollView
          ref={scrollView}
          horizontal={true}
          onContentSizeChange={() => scrollView.current?.scrollToEnd()}
          onTouchEnd={() => Platform.OS !== "web" && playMessage()}
          onPointerUp={() => Platform.OS === "web" && playMessage()}
          style={{ cursor: messageButtons.length > 0 ? 'pointer' : undefined }}
        >
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            {showText && labelLocation === "top" && <Text>{message}</Text>}
            {showSymbols &&
            <View style={{ display: 'flex', flexDirection: 'row' }}>
            {messageButtons.map((button, i) => button.image && (
              <TileImage
                key={i}
                uri={button.image}
                style={{ width: 40, height: 40 }}
              />
            ))}
            </View>
            }
            {showText && labelLocation === "bottom" && <Text>{message}</Text>}
          </View>
        </ScrollView>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
          {messageButtonsIds.length > 0 && <>
            {showShareButton &&
            <Pressable
              style={styles.button}
              onPress={copyMessage}
            >
              {copied ? <ClipboardCheck size={30} color="green" /> : <Copy size={30} />}
            </Pressable>
            }
            {showBackspace &&
            <Pressable
              style={styles.button}
              onPress={removeLastMessageButtonId}
            >
              <Delete size={30} />
            </Pressable>
            }
            <Pressable
              style={styles.button}
              onPress={clearMessageButtonIds}
            >
              <X size={30} />
            </Pressable>
          </>}
        </View>
      </View>
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={() => setShowModal(true)}
        >
          <EllipsisVertical size={30} />
        </Pressable>
      </View>
    </View>
    <Modal
      visible={showModal}
      animationType="none"
      onRequestClose={() => setShowModal(false)}
      transparent
    >
      <Pressable
        style={{ flex:1, backdropFilter: 'blur(3px)' }}
        onPress={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Pressable
              style={styles.modalButton}
              onPress={requestFullscreen}
            >
              <Fullscreen size={40} />
              <Text style={styles.modalButtonText}>Full screen</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => { setShowModal(false); push('/settings') }}
            >
              <Settings size={40} />
              <Text style={styles.modalButtonText}>Settings</Text>
            </Pressable>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Pressable
              style={styles.modalButton}
              onPress={() => { clearMessageButtonIds(); setShowModal(false) }}
            >
              <X size={40} />
              <Text style={styles.modalButtonText}>Clear message</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => { copyMessage(); setShowModal(false) }}
            >
              <Copy size={40} />
              <Text style={styles.modalButtonText}>Copy to clipboard</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  </>
}

const styles = StyleSheet.create({
  button: {
    padding: 5
  },
  modalContainer: {
    width: '80%',
    maxWidth: 600,
    backgroundColor: 'white',
    margin: 'auto',
    overflow: 'hidden',
    borderRadius: 20,
  },
  modalButton: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'lightgrey',
    cursor: 'pointer'
  },
  modalButtonText: {
    fontSize: 20,
    textAlign: 'center'
  }
})