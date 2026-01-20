import { AACTree, getProcessor } from "@willwade/aac-processors/browser";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import MessageWindow from "../components/MessageWindow";
import Page from "../components/Page";
import { useCurrentPageId, usePagesetActions } from "../stores/pagesets";
import { useMessageWindowLocation } from "../stores/prefs";
import { handleError } from "../utils/error";
import { getFileExt, loadFile } from "../utils/file";
import { getHomePageId } from "../utils/pagesets";

export default function Board() {
  const { board } = useLocalSearchParams()
  const { navigate } = useRouter()
  const { setOptions } = useNavigation()
  const messageWindowLocation = useMessageWindowLocation()
  const currentPageId = useCurrentPageId()
  const { setCurrentPageId } = usePagesetActions()
  const [tree, setTree] = useState<AACTree>()

  useEffect(() => {(async () => {
    if (typeof board !== 'string') return
    try {
      const treeFile = await loadFile(board)
      if (!treeFile) return handleError('Could not load file')
      const ext = getFileExt(board)
      const processor = getProcessor(`.${ext}`)
      const tree = await processor.loadIntoTree(treeFile)
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
  })()}, [board])

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
    onNavigateHome={handleNavigateHome}
    onOpenSettings={() => navigate('/settings')}
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
        {/* {!page && <Loader2 style={styles.loadingSpinner} size={48} />} */}
      </View>
      {messageWindowLocation === "bottom" && messageWindow}
    </View>
  )
}
