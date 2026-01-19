import { AACTree, getProcessor } from "@willwade/aac-processors/browser";
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { nanoid } from "nanoid";
import { useEffect, useMemo, useState } from "react";
import { Button, Platform, View } from "react-native";
import Page from "./components/Page";
import { useCurrentPageId, useCurrentTreeFile, usePageActions } from "./stores/page";
import { handleError } from "./utils/error";
import { loadFile, saveFile } from "./utils/file";

const getArrayBuffer = async (asset: DocumentPicker.DocumentPickerAsset) => {
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  return await file?.arrayBuffer()
}

const getFileExt = (name: string): string => {
  const ext = name.split(".").pop()
  return ext ? `.${ext.toLowerCase()}` : ''
}

const selectFile = async (onSuccess: (treeFile: string) => void) => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true
  })
  const asset = result.assets?.at(0)
  if (!asset) return handleError("No file selected")
  const arrayBuffer = await getArrayBuffer(asset)
  if (!arrayBuffer) return handleError("Could not read file")
  const ext = getFileExt(asset.name)
  const fileName = `${nanoid()}.${ext}`
  await saveFile(fileName, arrayBuffer)
  onSuccess(fileName)
}

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
    if (!(currentPageId in tree.pages)) {
      handleError('Could not find page in tree')
      return undefined
    }
    return tree.pages[currentPageId]
  }, [currentPageId, tree])

  const handleOpenFile = () => selectFile(treeFile => {
    addTreeFile(treeFile)
    setCurrentTreeFile(treeFile)
  })
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
