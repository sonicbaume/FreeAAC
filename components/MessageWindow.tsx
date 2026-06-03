import { preventExitHoldDuration, preventExitTapCount } from "@/utils/consts"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import * as Clipboard from "expo-clipboard"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  ArrowLeft,
  Copy,
  CopyCheck,
  Delete,
  EllipsisVertical,
  Home,
  LibraryBig,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react-native"
import { useEffect, useRef, useState } from "react"
import { Platform, ScrollView, View } from "react-native"
import Toast from "react-native-toast-message"
import { useSpeak } from "../stores/audio"
import {
  useEditMode,
  useMessageButtons,
  usePagesetActions,
} from "../stores/boards"
import {
  useBackButton,
  useButtonView,
  useClearMessageOnPlay,
  useLabelLocation,
  usePreventExit,
  useShowBackspace,
  useShowShareButton,
} from "../stores/prefs"
import { useDebounce } from "../utils/debounce"
import { HEADER_HEIGHT, ICON_SIZE, PADDING, useTheme } from "../utils/theme"
import DialogConfirm from "./DialogConfirm"
import PageOptions from "./Page/PageOptions"
import PageTitle from "./Page/PageTitle"
import { Button, Text } from "./Styled"
import TileImage from "./Tile/TileImage"

export default function MessageWindow({
  navigateHome,
  navigateBack,
  isHome,
  pageTitle,
  setPageTitle,
  openPageNav,
  deletePage,
  rootPage,
  setRootPage,
  openAddPage,
}: {
  navigateHome: () => void
  navigateBack: () => void
  isHome: boolean
  pageTitle?: string
  setPageTitle: (title: string | undefined) => void
  openPageNav: () => void
  deletePage: () => void
  rootPage?: string
  setRootPage: (id: string) => void
  openAddPage: () => void
}) {
  const theme = useTheme()
  const { boardId, pageId } = useLocalSearchParams()
  const debounce = useDebounce()
  const optionsSheet = useRef<TrueSheet>(null)
  const [copied, setCopied] = useState(false)
  const [exitTapCount, setExitTapCount] = useState(0)
  const [showSetDefaultPageDialog, setShowSetDefaultPageDialog] =
    useState(false)
  const [showDeletePageDialog, setShowDeletePageDialog] = useState(false)
  const scrollView = useRef<ScrollView>(null)
  const messageButtons = useMessageButtons()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const showShareButton = useShowShareButton()
  const showBackspace = useShowBackspace()
  const buttonView = useButtonView()
  const labelLocation = useLabelLocation()
  const editMode = useEditMode()
  const preventExit = usePreventExit()
  const backButton = useBackButton()
  const {
    removeLastMessageButton,
    clearMessageButtons,
    toggleEditMode,
    logEvent,
  } = usePagesetActions()
  const speak = useSpeak()
  const { dismissTo } = useRouter()
  const isRootPage = rootPage !== undefined && rootPage === pageId

  const hasMessage = messageButtons.length > 0
  const showSymbols = buttonView === "both" || buttonView === "symbol"
  const showText = buttonView === "both" || buttonView === "text"

  const message = messageButtons.map((b) => b.label).join(" ")

  const copyMessage = async () => {
    const success = await Clipboard.setStringAsync(message)
    if (success) setCopied(true)
    logEvent({ type: "copy" }, pageId as string, boardId as string)
  }
  useEffect(() => setCopied(false), [message])

  const playMessage = () =>
    debounce(() => {
      speak(message, {
        onDone: () => {
          if (clearMessageOnPlay) clearMessageButtons()
        },
      })
      logEvent(
        { type: "sentence", content: message },
        pageId as string,
        boardId as string,
      )
    })

  const navigateMenu = (isLongPress = false) => {
    console.log({ exitTapCount })
    if (preventExit === "hold" && !isLongPress) {
      return Toast.show({
        type: "info",
        text1: `Hold the button for ${preventExitHoldDuration / 1000} seconds to exit`,
      })
    } else if (
      preventExit === "tap" &&
      exitTapCount < preventExitTapCount - 1
    ) {
      if (exitTapCount === 0) {
        Toast.show({
          type: "info",
          text1: `Tap the button ${preventExitTapCount} times to exit`,
        })
      }
      setExitTapCount((count) => count + 1)
      return
    } else if (
      preventExit === "tap" &&
      exitTapCount >= preventExitTapCount - 1
    ) {
      setExitTapCount(0)
    }
    clearMessageButtons()
    dismissTo("/")
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
              <Button variant="ghost" onPress={openAddPage}>
                <Plus size={ICON_SIZE.xl} color={theme.onSurface} />
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowDeletePageDialog(true)}
                disabled={isRootPage}
              >
                <Trash2
                  size={ICON_SIZE.xl}
                  color={isRootPage ? theme.outline : theme.onSurface}
                />
              </Button>
              <Button
                variant="ghost"
                onPress={() => setShowSetDefaultPageDialog(true)}
                disabled={isRootPage}
              >
                <Star
                  size={ICON_SIZE.xl}
                  color={isRootPage ? theme.outline : theme.onSurface}
                  fill={theme.outline}
                  fillOpacity={isRootPage ? 1 : 0}
                />
              </Button>
            </>
          )}
          {!editMode && (
            <>
              {isHome && (
                <Button
                  variant="ghost"
                  onPress={() => navigateMenu()}
                  onLongPress={() => navigateMenu(true)}
                  delayLongPress={preventExitHoldDuration}
                >
                  <LibraryBig size={ICON_SIZE.xl} color={theme.onSurface} />
                </Button>
              )}
              {!isHome && (backButton === "home" || backButton === "both") && (
                <Button
                  variant="ghost"
                  onPress={() => {
                    navigateHome()
                    logEvent(
                      { type: "home" },
                      pageId as string,
                      boardId as string,
                    )
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
                    logEvent(
                      { type: "back" },
                      pageId as string,
                      boardId as string,
                    )
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
                        removeLastMessageButton()
                        logEvent(
                          { type: "backspace" },
                          pageId as string,
                          boardId as string,
                        )
                      }}
                    >
                      <Delete size={ICON_SIZE.xl} color={theme.onSurface} />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onPress={() => {
                      clearMessageButtons()
                      logEvent(
                        { type: "clear" },
                        pageId as string,
                        boardId as string,
                      )
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
          if (pageId) setRootPage(pageId as string)
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
