


import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { nanoid } from "nanoid";
import { Platform } from "react-native";
import { handleError } from "./error";

export const saveFile = async (
  fileName: string,
  data: Uint8Array<ArrayBuffer>,
  storageType: 'document' | 'cache'
): Promise<string> => {
  let path = fileName
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const root = storageType === 'cache' ? Paths.cache : Paths.document
    path = `${root}/${fileName}`
    const file = new File(path)
    file.create()
    file.write(data)
  } else if (Platform.OS === "web") {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(path, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(data)
    await writable.close()
  } else {
    throw "Not yet supported on this platform"
  }
  return path
}

export const loadFile = async (fileName: string): Promise<globalThis.File | undefined> => {
  if (Platform.OS !== "web") return handleError("Not yet supported on this platform")
  const root = await navigator.storage.getDirectory()
  const fileHandle = await root.getFileHandle(fileName)
  return await fileHandle.getFile()
}

const getData = async (asset: DocumentPicker.DocumentPickerAsset):
  Promise<Uint8Array<ArrayBuffer>> =>
{
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  if (!file) throw new Error("Could not read file")
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
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
  const data = await getData(asset)
  const ext = getFileExt(asset.name)
  const uuid = `${nanoid()}.${ext}`
  const fileName = await saveFile(uuid, data, 'document')
  return fileName
}
