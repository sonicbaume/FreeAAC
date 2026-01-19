


import * as Crypto from 'expo-crypto';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { Platform } from "react-native";

const getUUID = () => Crypto.randomUUID();

export const saveFile = async (
  fileName: string,
  data: ArrayBuffer,
  storageType: 'document' | 'cache'
): Promise<string> => {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const root = storageType === 'cache' ? Paths.cache : Paths.document
    const file = new File(root, fileName)
    file.uri
    file.create()
    file.write(new Uint8Array(data))
    return file.uri
  } else if (Platform.OS === "web") {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(data)
    await writable.close()
    return fileName
  } else {
    throw "File save not yet supported on this platform"
  }
}

export const loadFile = async (fileName: string):
  Promise<ArrayBuffer> =>
{
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const file = new File(fileName)
    return await file.arrayBuffer()
  } else if (Platform.OS === "web") {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(fileName)
    const file = await fileHandle.getFile()
    return await file.arrayBuffer()
  } else {
    throw "File load not yet supported on this platform"
  }
}

const getAssetData = async (asset: DocumentPicker.DocumentPickerAsset):
  Promise<ArrayBuffer> =>
{
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  if (!file) throw new Error("Could not read file")
  return await file.arrayBuffer()
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
  const data = await getAssetData(asset)
  const ext = getFileExt(asset.name)
  const uuid = `${getUUID()}.${ext}`
  const fileName = await saveFile(uuid, data, 'document')
  return fileName
}
