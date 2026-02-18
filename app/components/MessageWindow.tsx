import { TrueSheet } from '@lodev09/react-native-true-sheet';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { ClipboardCheck, Copy, Delete, EllipsisVertical, Home, Layers, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSpeak } from "../stores/audio";
import { useEditMode, useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useButtonView, useClearMessageOnPlay, useLabelLocation, useShowBackspace, useShowShareButton } from "../stores/prefs";
import { BoardButton } from "../utils/types";
import PageOptions from './PageOptions';
import TileImage from "./TileImage";

export default function MessageWindow({
  navigateHome,
  buttons,
  isHome,
  pageTitle,
}: {
  navigateHome: () => void;
  buttons: BoardButton[];
  isHome: boolean;
  pageTitle?: string;
}) {
  const optionsSheet = useRef<TrueSheet>(null)
  const [copied, setCopied] = useState(false)
  const scrollView = useRef<ScrollView>(null)
  const messageButtonsIds = useMessageButtonsIds()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const showShareButton = useShowShareButton()
  const showBackspace = useShowBackspace()
  const buttonView = useButtonView()
  const labelLocation = useLabelLocation()
  const editMode = useEditMode()
  const { removeLastMessageButtonId, clearMessageButtonIds, toggleEditMode } = usePagesetActions()
  const speak = useSpeak()
  const { replace } = useRouter()

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

  return <>
    <View style={{
      height: 60,
      flexDirection: "row",
      backgroundColor: 'white',
    }}>
      {!editMode &&
      <View style={{ padding: 10 }}>
        <Pressable
          style={styles.button}
          onPress={handleHomePress}
        >
          {!isHome && <Home size={30} />}
          {isHome && <Layers size={30} />}
        </Pressable>
      </View>
      }
      {!editMode &&
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
      }
      {editMode &&
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee' }}>
        <Text>{pageTitle}</Text>
      </View>      
      }
      <View style={{ padding: 10 }}>
        {editMode &&
        <Pressable
          style={styles.button}
          onPress={() => toggleEditMode()}
        >
          <X size={30} />
        </Pressable>
        }
        {!editMode &&
        <Pressable
          style={styles.button}
          onPress={() => optionsSheet.current?.present()}
        >
          <EllipsisVertical size={30} />
        </Pressable>
        }
      </View>
    </View>
    <PageOptions
      ref={optionsSheet}
      copyMessage={messageButtonsIds.length > 0 ? copyMessage : undefined}
    />
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