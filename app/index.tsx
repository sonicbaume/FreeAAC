import { AACTree, getProcessor } from "@willwade/aac-processors/browser";
import { useEffect, useMemo, useState } from "react";
import { Button, View } from "react-native";
import Page from "./components/Page";
import { useCurrentPageId, useCurrentTreeFile, usePageActions } from "./stores/page";
import { handleError } from "./utils/error";
import { getFileExt, loadFile, selectFile } from "./utils/file";

export default function Index() {
  const currentTreeFile = useCurrentTreeFile()
  const currentPageId = useCurrentPageId()
  const { setCurrentPageId, setCurrentTreeFile, addTreeFile } = usePageActions()
  const [tree, setTree] = useState<AACTree>()

  useEffect(() => {(async () => {
    if (!currentTreeFile) return
    const treeFile = await loadFile(currentTreeFile)
    if (!treeFile) return handleError('Could not load file')
    const processor = getProcessor(getFileExt(currentTreeFile))
    const arrayBuffer = await treeFile.arrayBuffer()
    const tree = await processor.loadIntoTree(arrayBuffer)
    console.log(tree)
    if (Object.keys(tree.pages).length < 1) return handleError("No pages found")
    setTree(tree)

    if (!currentPageId || !(currentPageId in tree.pages)) {
      const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
      if (!(defaultPageId in tree.pages)) return handleError("Could not find default page")
      setCurrentPageId(defaultPageId)
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
  return (
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
  );
}
