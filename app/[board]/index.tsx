import { AACTree } from "@willwade/aac-processors/browser";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MessageWindow from "../components/MessageWindow";
import Page from "../components/Page";
import { useBoards, useCurrentPageId, usePagesetActions } from "../stores/boards";
import { useMessageWindowLocation } from "../stores/prefs";
import { handleError } from "../utils/error";
import { loadBoard } from "../utils/file";
import { getHomePageId } from "../utils/pagesets";

export default function Board() {
  const { board } = useLocalSearchParams()
  const boards = useBoards()
  const uri = boards.find(b => b.id === board)?.uri
  const { setOptions } = useNavigation()
  const messageWindowLocation = useMessageWindowLocation()
  const currentPageId = useCurrentPageId()
  const { setCurrentPageId } = usePagesetActions()
  const [tree, setTree] = useState<AACTree>()

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

  const handleNavigateHome = () => {
    if (!tree) return
    try {
      const homePageId = getHomePageId(tree)
      setCurrentPageId(homePageId)
    } catch (e) {
      handleError(e)
    }
  }

  const page = useMemo(() => {
    if (!tree || !currentPageId) return
    if (!(currentPageId in tree.pages)) return handleError('Could not find page in tree')
    return tree.pages[currentPageId]
  }, [currentPageId, tree])

  useEffect(() => page && setOptions({ title: page.name }), [page])

  const messageWindow = (
  <MessageWindow
    navigateHome={handleNavigateHome}
  />)

  console.log({page})
  
  return (
    <View style={{ flex: 1 }}>
      {messageWindowLocation === "top" && messageWindow}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {page && <Page page={page} />}
        {!page && <ActivityIndicator size="large" />}
      </View>
      {messageWindowLocation === "bottom" && messageWindow}
    </View>
  )
}
