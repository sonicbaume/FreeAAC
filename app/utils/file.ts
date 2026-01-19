


import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { nanoid } from "nanoid";
import { Platform } from "react-native";
import { handleError } from "./error";

export const saveFile = async (fileName: string, data: FileSystemWriteChunkType) => {
  if (Platform.OS !== "web") return handleError("Not yet supported on this platform")
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export const loadFile = async (fileName: string): Promise<globalThis.File | undefined> => {
  if (Platform.OS !== "web") return handleError("Not yet supported on this platform")
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName);
  return await fileHandle.getFile();
}

const getArrayBuffer = async (asset: DocumentPicker.DocumentPickerAsset) => {
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  return await file?.arrayBuffer()
}

export const getFileExt = (name: string): string => {
  const ext = name.split(".").pop()
  return ext ? `.${ext.toLowerCase()}` : ''
}

export const selectFile = async (): Promise<string> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true
  })
  const asset = result.assets?.at(0)
  if (!asset) throw new Error("No file selected")
  const arrayBuffer = await getArrayBuffer(asset)
  if (!arrayBuffer) throw new Error("Could not read file")
  const ext = getFileExt(asset.name)
  const fileName = `${nanoid()}.${ext}`
  await saveFile(fileName, arrayBuffer)
  return fileName
}
