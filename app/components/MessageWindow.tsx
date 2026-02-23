import { TrueSheet } from '@lodev09/react-native-true-sheet';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from "expo-router";
import { Copy, CopyCheck, Delete, EllipsisVertical, Home, Layers, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";
import { useSpeak } from "../stores/audio";
import { useEditMode, useMessageButtonsIds, usePagesetActions } from "../stores/boards";
import { useButtonView, useClearMessageOnPlay, useLabelLocation, useShowBackspace, useShowShareButton } from "../stores/prefs";
import { HEADER_HEIGHT, ICON_SIZE, PADDING, useTheme } from '../utils/theme';
import { BoardButton } from "../utils/types";
import PageOptions from './PageOptions';
import PageTitle from './PageTitle';
import { Button } from './Styled';
import TileImage from "./TileImage";

export default function MessageWindow({
  navigateHome,
  buttons,
  isHome,
  pageTitle,
  setPageTitle,
}: {
  navigateHome: () => void;
  buttons: BoardButton[];
  isHome: boolean;
  pageTitle?: string;
  setPageTitle: (title: string) => void;
}) {
  const theme = useTheme()
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

  const hasMessage = messageButtonsIds.length > 0
  const showSymbols = buttonView === "both" || buttonView === "symbol"
  const showText = buttonView === "both" || buttonView === "text"

  const messageButtons = messageButtonsIds
    .map(id => buttons.find(b => b.id === id))
    .filter(b => b !== undefined)
  const message =  messageButtons.map(b => b.label).join(' ')

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
      height: HEADER_HEIGHT,
      display: 'flex',
      flexDirection: "row",
      backgroundColor: theme.surfaceContainer,
    }}>
      {!editMode &&
      <View style={{ padding: PADDING.lg }}>
        <Button variant="ghost" onPress={handleHomePress}>
          {!isHome && <Home size={ICON_SIZE.xl} color={theme.onSurface} />}
          {isHome && <Layers size={ICON_SIZE.xl} color={theme.onSurface} />}
        </Button>
      </View>
      }
      {!editMode && hasMessage &&
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.background }}>
        <ScrollView
          ref={scrollView}
          horizontal={true}
          onContentSizeChange={() => scrollView.current?.scrollToEnd()}
          onTouchEnd={() => Platform.OS !== "web" && playMessage()}
          onPointerUp={() => Platform.OS === "web" && playMessage()}
          style={{ cursor: hasMessage ? 'pointer' : undefined }}
        >
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            {showText && labelLocation === "top" && <Text>{message}</Text>}
            {showSymbols &&
            <View style={{ display: 'flex', flexDirection: 'row' }}>
            {messageButtons.map((button, i) => button.image && (
              <TileImage
                key={i}
                uri={button.image}
                style={{ width: ICON_SIZE.xl, height: ICON_SIZE.xl }}
              />
            ))}
            </View>
            }
            {showText && labelLocation === "bottom" && <Text>{message}</Text>}
          </View>
        </ScrollView>
        <View style={{ display: 'flex', flexDirection: 'row', padding: PADDING.lg }}>
          {hasMessage && <>
            {showShareButton &&
            <Button variant="ghost" onPress={copyMessage}>
              {copied
                ? <CopyCheck size={ICON_SIZE.xl} color={theme.onSurface} />
                : <Copy size={ICON_SIZE.xl} color={theme.onSurface} />}
            </Button>
            }
            {showBackspace &&
            <Button variant="ghost" onPress={removeLastMessageButtonId}>
              <Delete size={ICON_SIZE.xl} color={theme.onSurface} />
            </Button>
            }
            <Button variant="ghost" onPress={clearMessageButtonIds}>
              <X size={ICON_SIZE.xl} color={theme.onSurface} />
            </Button>
          </>}
        </View>
      </View>
      }
      {(editMode || !hasMessage) &&
      <PageTitle title={pageTitle} onChange={setPageTitle} />
      }
      <View style={{ padding: PADDING.lg }}>
        {editMode &&
        <Button variant="ghost" onPress={() => toggleEditMode()}>
          <X size={ICON_SIZE.xl} color={theme.onSurface} />
        </Button>
        }
        {!editMode &&
        <Button variant="ghost" onPress={() => optionsSheet.current?.present()}
        >
          <EllipsisVertical size={ICON_SIZE.xl} color={theme.onSurface} />
        </Button>
        }
      </View>
    </View>
    <PageOptions
      ref={optionsSheet}
      copyMessage={hasMessage ? copyMessage : undefined}
    />
  </>
}
