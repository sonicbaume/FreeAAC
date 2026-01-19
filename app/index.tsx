import { AACTree, getProcessor } from "@willwade/aac-processors/browser";
import { useEffect, useMemo, useState } from "react";
import { Button, Modal, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MessageWindow from "./components/MessageWindow";
import Page from "./components/Page";
import Settings from "./components/Settings";
import { useCurrentPageId, useCurrentTreeFile, usePagesetActions } from "./stores/pagesets";
import { useMessageWindowLocation } from "./stores/prefs";
import { handleError } from "./utils/error";
import { getFileExt, loadFile, selectFile } from "./utils/file";
import { getHomePageId } from "./utils/pagesets";

export default function Index() {
  const insets = useSafeAreaInsets();
  const [showSettings, setShowSettings] = useState(false)
  const currentTreeFile = useCurrentTreeFile()
  const currentPageId = useCurrentPageId()
  const messageWindowLocation = useMessageWindowLocation()
  const { setCurrentPageId, setCurrentTreeFile, addTreeFile } = usePagesetActions()
  const [tree, setTree] = useState<AACTree>()

  useEffect(() => {(async () => {
    if (!currentTreeFile) return
    try {
      const treeFile = await loadFile(currentTreeFile)
      if (!treeFile) return handleError('Could not load file')
      const processor = getProcessor(getFileExt(currentTreeFile))
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
  })()}, [currentTreeFile])

  const page = useMemo(() => {
    if (!tree || !currentPageId) return
    if (!(currentPageId in tree.pages)) return handleError('Could not find page in tree')
    return tree.pages[currentPageId]
  }, [currentPageId, tree])

  const handleOpenFile = async () => {
    try {
      const treeFile = await selectFile()
      addTreeFile(treeFile)
      setCurrentTreeFile(treeFile)
    } catch (e) {
      handleError(e)
    }
  }

  const handleNavigateHome = () => {
    if (!tree) return
    try {
      const homePageId = getHomePageId(tree)
      setCurrentPageId(homePageId)
    } catch (e) {
      handleError(e)
    }
  }
  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const messageWindow = (
  <MessageWindow
    onNavigateHome={handleNavigateHome}
    onOpenSettings={handleOpenSettings}
  />)

  return <>
    <View style={{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom }}>
      {messageWindowLocation === "top" && messageWindow}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {page && <Page page={page} />}
        {!page && <Button title="Import board" onPress={handleOpenFile}/>}
      </View>
      {messageWindowLocation === "bottom" && messageWindow}
    </View>
    <Modal
      visible={showSettings}
      transparent={true}
      animationType="none"
    >
      <Settings
        onClose={() => setShowSettings(false)}
      />
    </Modal>
  </>
}
