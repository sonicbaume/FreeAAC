import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { Image } from "expo-image"
import { Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MessageWindow from "../components/MessageWindow"
import Page from "../components/Page"
import PageNav from "../components/PageNav"
import {
  useBoards,
  useCurrentPageId,
  usePagesetActions,
} from "../stores/boards"
import { useDebounceTime, useMessageWindowLocation } from "../stores/prefs"
import { getHomePageId } from "../utils/boards"
import { DebounceContext, handleDebounce } from "../utils/debounce"
import { handleError } from "../utils/error"
import { loadBoard, saveBoard } from "../utils/file"
import { useTheme } from "../utils/theme"
import { BoardButton, BoardPage, BoardTree, TileImage } from "../utils/types"

export type EditTile = {
  button: BoardButton | undefined
  image: TileImage | undefined
  index: number
}

const prefetchImages = (tree: BoardTree) => {
  Image.prefetch(
    Object.values(tree.pages)
      .map((page) => page.images)
      .flat()
      .filter((image) => image !== undefined)
      .map((image) => {
        if (image.path || image.data) return undefined
        if (image.data_url?.startsWith("http")) return image.data_url
        return image.url
      })
      .filter((image) => image !== undefined),
  )
}

export default function Board() {
  const theme = useTheme()
  const debounceTime = useDebounceTime()
  const lastTimeRef = useRef(0)
  const { board } = useLocalSearchParams()
  const boards = useBoards()
  const uri = boards.find((b) => b.id === board)?.uri
  const messageWindowLocation = useMessageWindowLocation()
  const currentPageId = useCurrentPageId()
  const { navigateToPage, navigateBack, setCurrentBoardId } =
    usePagesetActions()
  const [tree, setTree] = useState<BoardTree>()
  const pageNavSheet = useRef<TrueSheet>(null)

  useEffect(
    () => setCurrentBoardId(board as string),
    [board, setCurrentBoardId],
  )

  useEffect(() => {
    ;(async () => {
      if (!uri) return
      try {
        const tree = await loadBoard(uri)
        console.log(tree)
        if (Object.keys(tree.pages).length < 1)
          return handleError("No pages found")
        setTree(tree)
        if (!currentPageId || !(currentPageId in tree.pages)) {
          const homePageId = getHomePageId(tree)
          navigateToPage(homePageId)
        }
        prefetchImages(tree)
      } catch (e) {
        handleError(e)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri])

  const page = useMemo(() => {
    if (!tree || !currentPageId) return
    if (!(currentPageId in tree.pages))
      return handleError("Could not find page in tree")
    return tree.pages[currentPageId]
  }, [currentPageId, tree])

  const savePage = (page: BoardPage) => {
    if (!uri) return handleError("Could not save page - file not defined")
    if (!tree) return handleError("Could not save page - tree does not exist")
    if (!currentPageId) return handleError("Could not save page - ID undefined")
    console.log("Saving page", page)
    const pages = { ...tree.pages }
    pages[currentPageId] = {
      ...pages[currentPageId],
      ...page,
    }
    const metadata = { ...tree.metadata }
    if (currentPageId === metadata.defaultHomePageId) {
      metadata.name = page.name
    }
    const newTree = {
      ...tree,
      metadata,
      pages,
    }
    saveBoard(uri, newTree)
    setTree(newTree)
  }

  const homePageId = useMemo(() => {
    try {
      if (tree) return getHomePageId(tree)
    } catch (e) {
      handleError(e)
    }
  }, [tree])

  const navigateHome = useCallback(
    () => homePageId && navigateToPage(homePageId),
    [homePageId, navigateToPage],
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

  const deletePage = () => {
    if (!uri) return handleError("Could not delete page - file not defined")
    if (!tree) return handleError("Could not delete page - tree does not exist")
    if (!currentPageId)
      return handleError("Could not delete page - ID undefined")
    if (currentPageId === tree.metadata.defaultHomePageId)
      return handleError("Cannot delete default page")
    if (!(currentPageId in tree.pages))
      return handleError("Could not find page to delete")

    console.log("Deleting page", currentPageId)
    const { [currentPageId]: _, ...pages } = tree.pages
    console.log("tree without", pages)
    const newTree = {
      ...tree,
      pages,
    }
    saveBoard(uri, newTree)
    setTree(newTree)
    navigateHome()
  }

  const setDefaultPageId = (defaultHomePageId: string) => {
    if (!uri)
      return handleError("Could not set default page - file not defined")
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
    saveBoard(uri, newTree)
    setTree(newTree)
  }

  const messageWindow = (
    <MessageWindow
      navigateHome={navigateHome}
      navigateBack={navigateBack}
      buttons={buttons}
      isHome={homePageId === page?.id}
      pageTitle={page?.name}
      setPageTitle={(name) => page && name && savePage({ ...page, name })}
      openPageNav={() => pageNavSheet.current?.present()}
      deletePage={deletePage}
      defaultPageId={tree?.metadata.defaultHomePageId}
      setDefaultPageId={setDefaultPageId}
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
              homePageId={homePageId}
              pageNames={pageNames}
            />
          )}
          {!page && <ActivityIndicator size="large" color={theme.onSurface} />}
        </View>
        {messageWindowLocation === "bottom" && messageWindow}
      </SafeAreaView>
      <PageNav ref={pageNavSheet} pages={pages} />
    </DebounceContext>
  )
}
