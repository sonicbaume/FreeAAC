import MessageWindow from "@/app/components/MessageWindow"
import Page from "@/app/components/Page/Page"
import PageAddSheet from "@/app/components/Page/PageAddSheet"
import PageNav from "@/app/components/Page/PageNav"
import { useBoards } from "@/app/stores/boards"
import { useDebounceTime, useMessageWindowLocation } from "@/app/stores/prefs"
import { generateNewPage } from "@/app/utils/boards"
import { DebounceContext, handleDebounce } from "@/app/utils/debounce"
import { handleError } from "@/app/utils/error"
import {
  deleteBoardPage,
  loadManifest,
  loadPage,
  saveBoardPage,
  saveRootPageId,
} from "@/app/utils/file"
import { useTheme } from "@/app/utils/theme"
import { BoardButton, BoardPage, TileImage } from "@/app/utils/types"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export type EditTile = {
  button: BoardButton | undefined
  image: TileImage | undefined
  index: number
}

export default function PageRoute() {
  const theme = useTheme()
  const boards = useBoards()
  const debounceTime = useDebounceTime()
  const lastTimeRef = useRef(0)
  const { boardId, pageId } = useLocalSearchParams()
  const id = boardId as string
  const currentPageId = pageId as string
  const messageWindowLocation = useMessageWindowLocation()
  const pageNavSheet = useRef<TrueSheet>(null)
  const pageAddSheet = useRef<TrueSheet>(null)
  const [page, setPage] = useState<BoardPage>()
  const [pages, setPages] = useState<{ name: string; id: string }[]>([])
  const [rootPageId, setRootPageId] = useState<string>()
  const { push, replace, back } = useRouter()

  useEffect(() => {
    ;(async () => {
      try {
        if (!currentPageId) return
        const pageObject = await loadPage(id, currentPageId)
        setPage(pageObject)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [currentPageId, id])

  useEffect(() => {
    ;(async () => {
      try {
        const board = boards.find((b) => b.id === id)
        if (!board) throw new Error("Could not find board metadata")
        const manifest = await loadManifest(id)
        setRootPageId(manifest.root)
        const pages = Object.entries(manifest.paths!.boards!).flatMap(
          ([id, path]) => {
            return [
              {
                name: board.pageNames ? board.pageNames[id] : id,
                id,
              },
            ]
          },
        )
        setPages(pages)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [boards, id])

  const savePage = async (page: BoardPage) => {
    if (!currentPageId) return handleError("Could not save page - ID undefined")
    console.log("Saving page", page)
    setPage(page)
    await saveBoardPage(id, currentPageId, page)
  }

  const navigateHome = () => {
    if (rootPageId) replace(`/${boardId}/${rootPageId}`)
  }

  const deletePage = async () => {
    if (!currentPageId)
      return handleError("Could not delete page - ID undefined")
    try {
      await deleteBoardPage(id, currentPageId)
    } catch (e) {
      handleError(e)
    }
    navigateHome()
  }

  const setDefaultPageId = async (defaultHomePageId: string) => {
    try {
      await saveRootPageId(id, defaultHomePageId)
      setRootPageId(defaultHomePageId)
    } catch (e) {
      handleError(e)
    }
  }

  const messageWindow = (
    <MessageWindow
      navigateHome={navigateHome}
      navigateBack={back}
      isHome={rootPageId === page?.id}
      pageTitle={page?.name}
      setPageTitle={(name) => page && name && savePage({ ...page, name })}
      openPageNav={() => pageNavSheet.current?.present()}
      deletePage={deletePage}
      defaultPageId={rootPageId}
      setDefaultPageId={setDefaultPageId}
      openAddPage={() => pageAddSheet.current?.present()}
    />
  )

  const debounce = useCallback(
    (action: () => unknown) =>
      handleDebounce(action, debounceTime, lastTimeRef),
    [debounceTime],
  )

  const addPage = async (name: string, rows: number, cols: number) => {
    if (!currentPageId)
      return handleError("Could not add page - current page not found")
    const page = generateNewPage(rows, cols, currentPageId, name)
    await saveBoardPage(id, page.id, page)
    push(`/${boardId}/${page.id}`)
    pageAddSheet.current?.dismiss()
  }

  return (
    <DebounceContext value={debounce}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {messageWindowLocation === "top" && messageWindow}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {page && (
            <Page
              page={page}
              savePage={savePage}
              homePageId={rootPageId}
              pages={pages}
              navigateToPage={(pageId) => push(`/${boardId}/${pageId}`)}
            />
          )}
          {!page && <ActivityIndicator size="large" color={theme.onSurface} />}
        </View>
        {messageWindowLocation === "bottom" && messageWindow}
      </SafeAreaView>
      <PageNav
        ref={pageNavSheet}
        pages={pages}
        navigateToPage={(pageId) => push(`/${boardId}/${pageId}`)}
      />
      <PageAddSheet ref={pageAddSheet} onAdd={addPage} />
    </DebounceContext>
  )
}
