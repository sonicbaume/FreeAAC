import MessageWindow from "@/components/MessageWindow"
import Page from "@/components/Page/Page"
import PageAddSheet from "@/components/Page/PageAddSheet"
import PageNav from "@/components/Page/PageNav"
import { useBoards, usePagesetActions } from "@/stores/boards"
import { useDebounceTime, useMessageWindowLocation } from "@/stores/prefs"
import { generateNewPage } from "@/utils/boards"
import { DebounceContext, handleDebounce } from "@/utils/debounce"
import { handleError } from "@/utils/error"
import {
  loadManifest,
  loadPage,
  saveBoardPage,
  saveManifest,
} from "@/utils/file"
import { removePath } from "@/utils/io"
import { useTheme } from "@/utils/theme"
import { BoardButton, BoardPage, TileImage } from "@/utils/types"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator } from "react-native"
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
  const board = boards.find((b) => b.id === id)
  const currentPageId = pageId as string
  const messageWindowLocation = useMessageWindowLocation()
  const pageNavSheet = useRef<TrueSheet>(null)
  const pageAddSheet = useRef<TrueSheet>(null)
  const [page, setPage] = useState<BoardPage>()
  const pages = board?.pages ?? []
  const [rootPageState, setRootPageState] = useState<string | undefined>(
    board?.rootPage,
  )
  const { push, dismissTo, back } = useRouter()
  const { updateBoard } = usePagesetActions()
  const path = pages.find((p) => p.id === pageId)?.path

  // Load page from .obf file
  useEffect(() => {
    ;(async () => {
      try {
        if (!currentPageId || !path) return
        const pageObject = await loadPage(id, currentPageId, path)
        setPage(pageObject)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [currentPageId, id, path])

  // Load root page from manifest if unknown
  useEffect(() => {
    ;(async () => {
      if (rootPageState) return
      try {
        const manifest = await loadManifest(id)
        if (!manifest.root) return handleError("No root in manifest")
        updateBoard(id, { rootPage: manifest.root })
        setRootPageState(manifest.root)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [boards, id, rootPageState, updateBoard])

  const savePage = async (page: BoardPage) => {
    if (!currentPageId) return handleError("Could not save page - ID undefined")
    console.log("Saving page", page)
    setPage(page)
    const path = pages.find((p) => p.id === page.id)?.path
    if (!path) return handleError("Could not save page - no path found")
    await saveBoardPage(id, currentPageId, page, path)
  }

  const navigateHome = () => {
    if (rootPageState) dismissTo(`/${boardId}/${rootPageState}`)
  }

  const isPageDuplicate = (name: string) => {
    if (pages.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      handleError("Page already exists - please choose a different name")
      return true
    }
    return false
  }

  const savePageTitle = (name: string | undefined): boolean => {
    if (!page || !name || isPageDuplicate(name)) return false
    savePage({ ...page, name })
    updateBoard(id, {
      pages: pages.map((p) => (p.id === page.id ? { ...p, name } : p)),
    })
    return true
  }

  const deletePage = async () => {
    const path = pages.find((p) => p.id === currentPageId)?.path
    if (!path) return handleError("Could not delete page - no path found")
    const manifest = await loadManifest(boardId as string)
    if (!manifest.paths?.boards) return handleError("Could not load manifest")
    delete manifest.paths.boards[currentPageId]
    saveManifest(boardId as string, manifest)
    updateBoard(boardId as string, {
      pages: pages.filter((p) => p.id !== currentPageId),
    })
    await removePath(`${boardId}/${path}`)
    navigateHome()
  }

  const setRoot = async (defaultHomePageId: string) => {
    try {
      const manifest = await loadManifest(id)
      manifest.root = defaultHomePageId
      await saveManifest(id, manifest)
      updateBoard(id, { rootPage: defaultHomePageId })
      setRootPageState(defaultHomePageId)
    } catch (e) {
      handleError(e)
    }
  }

  const messageWindow = (
    <MessageWindow
      navigateHome={navigateHome}
      navigateBack={back}
      isHome={rootPageState === page?.id}
      pageTitle={page?.name}
      setPageTitle={savePageTitle}
      openPageNav={() => pageNavSheet.current?.present()}
      deletePage={deletePage}
      rootPage={rootPageState}
      setRootPage={setRoot}
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
    if (isPageDuplicate(name)) return
    const page = generateNewPage(rows, cols, currentPageId, pages.length, name)
    const path = `${page.id}.obf`
    updateBoard(id, {
      ...board,
      pages: [
        ...pages,
        {
          id: page.id,
          name: page.name,
          path,
        },
      ],
    })
    await saveBoardPage(id, page.id, page, path)
    push(`/${boardId}/${page.id}`)
    pageAddSheet.current?.dismiss()
  }

  return (
    <DebounceContext value={debounce}>
      <SafeAreaView style={{ height: "100%" }}>
        {messageWindowLocation === "top" && messageWindow}
        {page && (
          <Page
            page={page}
            savePage={savePage}
            homePageId={rootPageState}
            navigateToPage={(pageId) => push(`/${boardId}/${pageId}`)}
          />
        )}
        {!page && (
          <ActivityIndicator
            style={{ marginVertical: "auto" }}
            size="large"
            color={theme.onSurface}
          />
        )}
        {messageWindowLocation === "bottom" && messageWindow}
      </SafeAreaView>
      <PageNav
        ref={pageNavSheet}
        navigateToPage={(pageId) => push(`/${boardId}/${pageId}`)}
      />
      <PageAddSheet
        ref={pageAddSheet}
        onAdd={addPage}
        numPages={pages.length}
      />
    </DebounceContext>
  )
}
