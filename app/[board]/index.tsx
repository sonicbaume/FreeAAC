import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageWindow from "../components/MessageWindow";
import Page from "../components/Page";
import { useBoards, useCurrentPageId, usePagesetActions } from "../stores/boards";
import { useMessageWindowLocation } from "../stores/prefs";
import { handleError } from "../utils/error";
import { loadBoard, saveBoard } from "../utils/file";
import { getHomePageId } from "../utils/pagesets";
import { BoardButton, BoardPage, BoardTree } from "../utils/types";

export type EditTile = {
  button: BoardButton;
  index: number;
}

export default function Board() {
  const { board } = useLocalSearchParams()
  const boards = useBoards()
  const uri = boards.find(b => b.id === board)?.uri
  const messageWindowLocation = useMessageWindowLocation()
  const currentPageId = useCurrentPageId()
  const { setCurrentPageId } = usePagesetActions()
  const [tree, setTree] = useState<BoardTree>()

  useEffect(() => {(async () => {
    if (!uri) return
    try {
      const tree = await loadBoard(uri)
      console.log(tree)
      if (Object.keys(tree.pages).length < 1) return handleError("No pages found")
      setTree(tree)
      if (!currentPageId || !(currentPageId in tree.pages)) {
        const homePageId = getHomePageId(tree)
        setCurrentPageId(homePageId)
      }
    } catch (e) {
      handleError(e)
    }
  })()}, [uri])

  const page = useMemo(() => {
    if (!tree || !currentPageId) return
    if (!(currentPageId in tree.pages)) return handleError('Could not find page in tree')
    return tree.pages[currentPageId]
  }, [currentPageId, tree])

  const savePage = (page: BoardPage) => {
    if (!uri) return handleError('Could not save page - file not defined')
    if (!tree) return handleError('Could not save page - tree does not exist')
    if (!currentPageId) return handleError('Could not save page - ID undefined')
    console.log("Saving page", page)
    const newPages = {...tree.pages}
    newPages[currentPageId] = {
      ...newPages[currentPageId],
      ...page
    }
    const newTree = {
      ...tree,
      pages: newPages
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

  const handleNavigateHome = () => homePageId && setCurrentPageId(homePageId)

  const buttons = useMemo(() => {
    if (!tree) return []
    return Object.values(tree.pages).map(page => page.buttons).flat() 
  }, [tree])

  const pageNames = useMemo(() => {
    if (!tree) return []
    return Object.values(tree.pages).map(({id, name}) => ({ id, name }))
  }, [tree])

  const messageWindow = (
  <MessageWindow
    navigateHome={handleNavigateHome}
    buttons={buttons}
    isHome={homePageId === page?.id}
  />)
  
  return <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1 }}>
      {messageWindowLocation === "top" && messageWindow}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {page && <Page page={page} savePage={savePage} homePageId={homePageId} pageNames={pageNames} />}
        {!page && <ActivityIndicator size="large" />}
      </View>
      {messageWindowLocation === "bottom" && messageWindow}
    </SafeAreaView>
  </>
}
