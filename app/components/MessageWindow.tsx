import { TrueSheet } from "@lodev09/react-native-true-sheet"
import * as Clipboard from "expo-clipboard"
import { useRouter } from "expo-router"
import {
  ArrowLeft,
  Copy,
  CopyCheck,
  Delete,
  EllipsisVertical,
  Forward,
  Home,
  LibraryBig,
  Star,
  Trash2,
  X,
} from "lucide-react-native"
import { useEffect, useRef, useState } from "react"
import { Platform, ScrollView, View } from "react-native"
import { useSpeak } from "../stores/audio"
import {
  useCurrentPageId,
  useCustomMessages,
  useEditMode,
  useMessageButtonsIds,
  usePagesetActions,
} from "../stores/boards"
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
import DialogConfirm from "./DialogConfirm"
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
  openPageNav,
  deletePage,
  defaultPageId,
  setDefaultPageId,
}: {
  navigateHome: () => void
  navigateBack: () => void
  buttons: { button: BoardButton; pageId: string }[]
  isHome: boolean
  pageTitle?: string
  setPageTitle: (title: string | undefined) => void
  openPageNav: () => void
  deletePage: () => void
  defaultPageId?: string
  setDefaultPageId: (id: string) => void
}) {
  const theme = useTheme()
  const debounce = useDebounce()
  const optionsSheet = useRef<TrueSheet>(null)
  const [copied, setCopied] = useState(false)
  const [showSetDefaultPageDialog, setShowSetDefaultPageDialog] =
    useState(false)
  const [showDeletePageDialog, setShowDeletePageDialog] = useState(false)
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
  const {
    removeLastMessageButtonId,
    clearMessageButtonIds,
    toggleEditMode,
    logEvent,
  } = usePagesetActions()
  const speak = useSpeak()
  const { replace } = useRouter()
  const isDefaultPage =
    defaultPageId !== undefined && defaultPageId === currentPageId
  console.log({ isDefaultPage, defaultPageId, currentPageId })

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
    logEvent({ type: "copy" })
  }
  useEffect(() => setCopied(false), [message])

  const playMessage = () =>
    debounce(() => {
      speak(message, {
        onDone: () => {
          if (clearMessageOnPlay) clearMessageButtonIds()
        },
      })
      logEvent({ type: "sentence", content: message })
    })

  const navigateMenu = () => {
    clearMessageButtonIds()
    replace("/")
  }

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
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: PADDING.lg,
          }}
        >
          {editMode && (
            <>
              <Button
                variant="ghost"
                onPress={() => setShowDeletePageDialog(true)}
                disabled={isDefaultPage}
              >
                <Trash2
                  size={ICON_SIZE.xl}
                  color={isDefaultPage ? theme.outline : theme.onSurface}
                />
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowSetDefaultPageDialog(true)}
                disabled={isDefaultPage}
              >
                <Star
                  size={ICON_SIZE.xl}
                  color={isDefaultPage ? theme.outline : theme.onSurface}
                  fill={theme.outline}
                  fillOpacity={isDefaultPage ? 1 : 0}
                />
              </Button>
              <Button variant="ghost" onPress={openPageNav}>
                <Forward size={ICON_SIZE.xl} color={theme.onSurface} />
              </Button>
            </>
          )}
          {!editMode && (
            <>
              {isHome && (
                <Button variant="ghost" onPress={navigateMenu}>
                  <LibraryBig size={ICON_SIZE.xl} color={theme.onSurface} />
                </Button>
              )}
              {!isHome && (backButton === "home" || backButton === "both") && (
                <Button
                  variant="ghost"
                  onPress={() => {
                    navigateHome()
                    logEvent({ type: "home" })
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
                    logEvent({ type: "back" })
                  }}
                >
                  <ArrowLeft size={ICON_SIZE.xl} color={theme.onSurface} />
                </Button>
              )}
            </>
          )}
        </View>
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
                        logEvent({ type: "backspace" })
                      }}
                    >
                      <Delete size={ICON_SIZE.xl} color={theme.onSurface} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onPress={() => {
                      clearMessageButtonIds()
                      logEvent({ type: "clear" })
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
        openPageNav={openPageNav}
      />
      <DialogConfirm
        visible={showSetDefaultPageDialog}
        message="Are you sure you want to set this as the starting page in this board?"
        onCancel={() => setShowSetDefaultPageDialog(false)}
        onConfirm={() => {
          if (currentPageId) setDefaultPageId(currentPageId)
          setShowSetDefaultPageDialog(false)
        }}
        confirmLabel="Yes"
      />
      <DialogConfirm
        visible={showDeletePageDialog}
        message="Are you sure you want to delete this page?"
        onCancel={() => setShowDeletePageDialog(false)}
        onConfirm={() => {
          deletePage()
          setShowDeletePageDialog(false)
        }}
      />
    </>
  )
}
