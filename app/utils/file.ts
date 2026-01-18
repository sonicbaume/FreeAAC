import { AACPage, getProcessor } from "@willwade/aac-processors/browser";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { handleError } from "./error";

export const selectFile = async (onSuccess: (page: AACPage) => void) => {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
  const fileName = result.assets?.at(0)
  if (!fileName) return handleError("No file selected")
  const file = new File(fileName.uri)
  const arrayBuffer = await file.arrayBuffer()

  const processor = getProcessor(file.extension)
  const tree = await processor.loadIntoTree(arrayBuffer)

  if (Object.keys(tree.pages).length < 1) return handleError("No pages found")
  const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
  if (!(defaultPageId in tree.pages)) return handleError("Could not find default page")
  onSuccess(tree.pages[defaultPageId])
}