import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MessageWindow from "../components/MessageWindow"
import Page from "../components/Page/Page"
import PageAddSheet from "../components/Page/PageAddSheet"
import PageNav from "../components/Page/PageNav"
import { useCurrentPageId, usePagesetActions } from "../stores/boards"
import { useDebounceTime, useMessageWindowLocation } from "../stores/prefs"
import { generateNewPage } from "../utils/boards"
import { DebounceContext, handleDebounce } from "../utils/debounce"
import { handleError } from "../utils/error"
import {
  deleteBoardPage,
  getRootPageId,
  loadPage,
  saveBoard,
  saveBoardPage
} from "../utils/file"
import { useTheme } from "../utils/theme"
import { BoardButton, BoardPage, BoardTree, TileImage } from "../utils/types"

export type EditTile = {
  button: BoardButton | undefined
  image: TileImage | undefined
  index: number
}

export default function Board() {
  const theme = useTheme()
  const debounceTime = useDebounceTime()
  const lastTimeRef = useRef(0)
  const { board } = useLocalSearchParams()
  const id = board as string
  const messageWindowLocation = useMessageWindowLocation()
  const currentPageId = useCurrentPageId()
  const { navigateToPage, navigateBack, setCurrentBoardId } =
    usePagesetActions()
  const [tree, setTree] = useState<BoardTree>()
  const pageNavSheet = useRef<TrueSheet>(null)
  const pageAddSheet = useRef<TrueSheet>(null)
  const [page, setPage] = useState<BoardPage>()
  const [rootPageId, setRootPageId] = useState<string>()

  useEffect(
    () => setCurrentBoardId(board as string),
    [board, setCurrentBoardId],
  )

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
        const pageId = await getRootPageId(id)
        navigateToPage(pageId)
        setRootPageId(pageId)
      } catch (e) {
        handleError(e)
      }
    })()
  }, [id, navigateToPage])

  const savePage = async (page: BoardPage) => {
    if (!currentPageId) return handleError("Could not save page - ID undefined")
    console.log("Saving page", page)
    setPage(page)
    await saveBoardPage(id, currentPageId, page)
  }

  const navigateHome = useCallback(
    () => rootPageId && navigateToPage(rootPageId),
    [navigateToPage, rootPageId],
  )

  const buttons = useMemo(() => {
    if (!tree) return []
    return Object.values(tree.pages)
      .map((page) => {
        const buttons = page.buttons as BoardButton[]
        return buttons.map((button) => {
          return {
            button,
            pageId: page.id,
          }
        })
      })
      .flat()
  }, [tree])

  const pageNames = useMemo(() => {
    if (!tree) return []
    return Object.values(tree.pages).map(({ id, name }) => ({
      value: id,
      label: name,
    }))
  }, [tree])

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

  const setDefaultPageId = (defaultHomePageId: string) => {
    if (!tree)
      return handleError("Could not set default page - tree does not exist")
    if (!(defaultHomePageId in tree.pages))
      return handleError("Could not set default page - page ID not found")
    const newTree = {
      ...tree,
      metadata: {
        ...tree.metadata,
        defaultHomePageId,
        name: tree.pages[defaultHomePageId].name,
      },
    }
    saveBoard(id, newTree)
    setTree(newTree)
  }

  const messageWindow = (
    <MessageWindow
      navigateHome={navigateHome}
      navigateBack={navigateBack}
      buttons={buttons}
      isHome={rootPageId === page?.id}
      pageTitle={page?.name}
      setPageTitle={(name) => page && name && savePage({ ...page, name })}
      openPageNav={() => pageNavSheet.current?.present()}
      deletePage={deletePage}
      defaultPageId={tree?.metadata.defaultHomePageId}
      setDefaultPageId={setDefaultPageId}
      openAddPage={() => pageAddSheet.current?.present()}
    />
  )

  const debounce = useCallback(
    (action: () => unknown) =>
      handleDebounce(action, debounceTime, lastTimeRef),
    [debounceTime],
  )

  const pages = useMemo(() => {
    if (!tree) return []
    return Object.entries(tree.pages).map(([id, page]) => ({
      id,
      name: page.name,
    }))
  }, [tree])

  const addPage = async (name: string, rows: number, cols: number) => {
    if (!tree) return handleError("Could not add page - tree does not exist")
    if (!currentPageId)
      return handleError("Could not add page - current page not found")
    const page = generateNewPage(rows, cols, currentPageId, name)
    const pages = { ...tree.pages }
    pages[page.id] = page
    const newTree = {
      ...tree,
      pages,
    }
    saveBoard(id, newTree)
    setTree(newTree)
    navigateToPage(page.id)
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
              pageNames={pageNames}
            />
          )}
          {!page && <ActivityIndicator size="large" color={theme.onSurface} />}
        </View>
        {messageWindowLocation === "bottom" && messageWindow}
      </SafeAreaView>
      <PageNav ref={pageNavSheet} pages={pages} />
      <PageAddSheet ref={pageAddSheet} onAdd={addPage} />
    </DebounceContext>
  )
}
