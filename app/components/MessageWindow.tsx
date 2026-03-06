import { TrueSheet } from "@lodev09/react-native-true-sheet"
import {
  AACSemanticCategory,
  AACSemanticIntent,
} from "@willwade/aac-processors/browser"
import * as Clipboard from "expo-clipboard"
import { useRouter } from "expo-router"
import {
  ArrowLeft,
  Copy,
  CopyCheck,
  Delete,
  EllipsisVertical,
  Home,
  Layers,
  X,
} from "lucide-react-native"
import { useCallback, useEffect, useRef, useState } from "react"
import { Platform, ScrollView, View } from "react-native"
import { useSpeak } from "../stores/audio"
import {
  useCurrentBoardId,
  useCurrentPageId,
  useCustomMessages,
  useEditMode,
  useMessageButtonsIds,
  usePagesetActions,
} from "../stores/boards"
import { LogEvent, useHistoryActions } from "../stores/history"
import {
  useBackButton,
  useButtonView,
  useClearMessageOnPlay,
  useLabelLocation,
  useShowBackspace,
  useShowShareButton,
} from "../stores/prefs"
import { useDebounce } from "../utils/debounce"
import { HEADER_HEIGHT, ICON_SIZE, PADDING, useTheme } from "../utils/theme"
import { BoardButton } from "../utils/types"
import PageOptions from "./PageOptions"
import PageTitle from "./PageTitle"
import { Button, Text } from "./Styled"
import TileImage from "./TileImage"

export default function MessageWindow({
  navigateHome,
  navigateBack,
  buttons,
  isHome,
  pageTitle,
  setPageTitle,
}: {
  navigateHome: () => void
  navigateBack: () => void
  buttons: { button: BoardButton; pageId: string }[]
  isHome: boolean
  pageTitle?: string
  setPageTitle: (title: string | undefined) => void
}) {
  const theme = useTheme()
  const debounce = useDebounce()
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
  const customMessages = useCustomMessages()
  const backButton = useBackButton()
  const currentPageId = useCurrentPageId()
  const currentBoardId = useCurrentBoardId()
  const { removeLastMessageButtonId, clearMessageButtonIds, toggleEditMode } =
    usePagesetActions()
  const { logEvent } = useHistoryActions()
  const speak = useSpeak()
  const { replace } = useRouter()

  const hasMessage = messageButtonsIds.length > 0
  const showSymbols = buttonView === "both" || buttonView === "symbol"
  const showText = buttonView === "both" || buttonView === "text"

  const messageButtons = messageButtonsIds
    .map((m) => {
      const matchingButton = buttons.find(
        (b) => b.button.id === m.id && b.pageId === m.pageId,
      )
      if (matchingButton) return matchingButton.button
      if (m.id in customMessages)
        return { label: customMessages[m.id], image: undefined }
      return undefined
    })
    .filter((b) => b !== undefined)
  const message = messageButtons.map((b) => b.label).join(" ")

  const copyMessage = async () => {
    const success = await Clipboard.setStringAsync(message)
    if (success) setCopied(true)
    logButtonPress("copy")
  }
  useEffect(() => setCopied(false), [message])

  const playMessage = () =>
    debounce(() => {
      speak(message, {
        onDone: () => {
          if (clearMessageOnPlay) clearMessageButtonIds()
        },
      })
      logButtonPress("speak")
    })

  const navigateMenu = () => {
    clearMessageButtonIds()
    replace("/")
  }

  const logButtonPress = useCallback(
    (type: "home" | "back" | "backspace" | "clear" | "copy" | "speak") => {
      const intent =
        type === "home" ? AACSemanticIntent.GO_HOME
        : type === "back" ? AACSemanticIntent.GO_BACK
        : type === "backspace" ? AACSemanticIntent.DELETE_WORD
        : type === "clear" ? AACSemanticIntent.CLEAR_TEXT
        : type === "copy" ? AACSemanticIntent.COPY_TEXT
        : type === "speak" ? AACSemanticIntent.SPEAK_TEXT
        : undefined
      const category =
        type === "home" ? AACSemanticCategory.NAVIGATION
        : type === "back" ? AACSemanticCategory.NAVIGATION
        : type === "backspace" ? AACSemanticCategory.TEXT_EDITING
        : type === "clear" ? AACSemanticCategory.TEXT_EDITING
        : type === "copy" ? AACSemanticCategory.TEXT_EDITING
        : type === "speak" ? AACSemanticCategory.COMMUNICATION
        : undefined
      let event: LogEvent = {
        type: "action",
        intent,
        category,
        boardId: currentBoardId,
        pageId: currentPageId,
      }
      if (type === "speak") {
        event = {
          ...event,
          type: "utterance",
          vocalization: message,
          spoken: true,
        }
      }
      logEvent(`:${type}`, event)
    },
    [currentBoardId, currentPageId, logEvent, message],
  )

  return (
    <>
      <View
        style={{
          height: HEADER_HEIGHT,
          display: "flex",
          flexDirection: "row",
          backgroundColor: theme.surfaceContainer,
        }}
      >
        {!editMode && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              padding: PADDING.lg,
            }}
          >
            {isHome && (
              <Button variant="ghost" onPress={navigateMenu}>
                <Layers size={ICON_SIZE.xl} color={theme.onSurface} />
              </Button>
            )}
            {!isHome && (backButton === "home" || backButton === "both") && (
              <Button
                variant="ghost"
                onPress={() => {
                  navigateHome()
                  logButtonPress("home")
                }}
              >
                <Home size={ICON_SIZE.xl} color={theme.onSurface} />
              </Button>
            )}
            {!isHome && (backButton === "back" || backButton === "both") && (
              <Button
                variant="ghost"
                onPress={() => {
                  navigateBack()
                  logButtonPress("back")
                }}
              >
                <ArrowLeft size={ICON_SIZE.xl} color={theme.onSurface} />
              </Button>
            )}
          </View>
        )}
        {!editMode && hasMessage && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              backgroundColor: theme.surface,
            }}
          >
            <ScrollView
              ref={scrollView}
              horizontal={true}
              onContentSizeChange={() => scrollView.current?.scrollToEnd()}
              onTouchEnd={() => Platform.OS !== "web" && playMessage()}
              onPointerUp={() => Platform.OS === "web" && playMessage()}
              style={{ cursor: hasMessage ? "pointer" : undefined }}
            >
              <View style={{ display: "flex", justifyContent: "center" }}>
                {showText && labelLocation === "top" && <Text>{message}</Text>}
                {showSymbols && (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    {messageButtons.map(
                      (button, i) =>
                        button.image && (
                          <TileImage
                            key={i}
                            uri={button.image}
                            style={{
                              width: ICON_SIZE.xl,
                              height: ICON_SIZE.xl,
                            }}
                          />
                        ),
                    )}
                  </View>
                )}
                {showText && labelLocation === "bottom" && (
                  <Text>{message}</Text>
                )}
              </View>
            </ScrollView>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                padding: PADDING.lg,
              }}
            >
              {hasMessage && (
                <>
                  {showShareButton && (
                    <Button variant="ghost" onPress={copyMessage}>
                      {copied ?
                        <CopyCheck
                          size={ICON_SIZE.xl}
                          color={theme.onSurface}
                        />
                      : <Copy size={ICON_SIZE.xl} color={theme.onSurface} />}
                    </Button>
                  )}
                  {showBackspace && (
                    <Button
                      variant="ghost"
                      onPress={() => {
                        removeLastMessageButtonId()
                        logButtonPress("backspace")
                      }}
                    >
                      <Delete size={ICON_SIZE.xl} color={theme.onSurface} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onPress={() => {
                      clearMessageButtonIds()
                      logButtonPress("clear")
                    }}
                  >
                    <X size={ICON_SIZE.xl} color={theme.onSurface} />
                  </Button>
                </>
              )}
            </View>
          </View>
        )}
        {(editMode || !hasMessage) && (
          <PageTitle title={pageTitle} onChange={setPageTitle} />
        )}
        <View style={{ padding: PADDING.lg }}>
          {editMode && (
            <Button variant="ghost" onPress={() => toggleEditMode()}>
              <X size={ICON_SIZE.xl} color={theme.onSurface} />
            </Button>
          )}
          {!editMode && (
            <Button
              variant="ghost"
              onPress={() => optionsSheet.current?.present()}
            >
              <EllipsisVertical size={ICON_SIZE.xl} color={theme.onSurface} />
            </Button>
          )}
        </View>
      </View>
      <PageOptions
        ref={optionsSheet}
        copyMessage={hasMessage ? copyMessage : undefined}
      />
    </>
  )
}
