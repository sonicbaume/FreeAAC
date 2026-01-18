import { AACPage, getProcessor } from "@willwade/aac-processors/browser";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Platform } from "react-native";
import { handleError } from "./error";

const getArrayBuffer = async (asset: DocumentPicker.DocumentPickerAsset) => {
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  return await file?.arrayBuffer()
}

const getFileExt = (name: string): string => {
  const ext = name.split(".").pop()
  return ext ? `.${ext.toLowerCase()}` : ''
}

export const selectFile = async (onSuccess: (page: AACPage) => void) => {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
  const asset = result.assets?.at(0)
  if (!asset) return handleError("No file selected")

  const arrayBuffer = await getArrayBuffer(asset)
  if (!arrayBuffer) return handleError("Could not read file")

  const processor = getProcessor(getFileExt(asset.name))
  const tree = await processor.loadIntoTree(arrayBuffer)
  console.log(tree)
  if (Object.keys(tree.pages).length < 1) return handleError("No pages found")
  
  const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
  if (!(defaultPageId in tree.pages)) return handleError("Could not find default page")
  onSuccess(tree.pages[defaultPageId])
}