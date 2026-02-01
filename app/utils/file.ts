


import { AACTree, getProcessor } from '@willwade/aac-processors/browser';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from "react-native";
import { uuid } from './uuid';

const zipAdapter = async (input: string | Buffer | ArrayBuffer | Uint8Array) => {
  console.log("USING ZIP ADAPTER")
  if (Platform.OS !== "android" && Platform.OS !== "ios")
    throw "Cannot use react-native-zip-archive on this platform"
  const { unzip } = await import('react-native-zip-archive')
  let inputPath = ""
  const outDir = new Directory(Paths.cache, uuid())
  outDir.create()
  if (typeof(input) === "string") {
    inputPath = input
  } else {
    const inFile = new File(Paths.cache, `${uuid()}.zip`)
    inputPath = inFile.uri
    inFile.create()
    inFile.write(new Uint8Array(input))
  }
  console.log({unzip})
  const result = await unzip(inputPath, outDir.uri)
  return {
    zip: {
      listFiles: (): string[] => outDir.list().map(item => item.uri),
      readFile: async (name: string): Promise<Uint8Array> => {
        const buffer = await loadFile(Paths.join(outDir, name))
        return new Uint8Array(buffer)
      }
    }
  }
}

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
    try {
      const root = await navigator.storage.getDirectory()
      const fileHandle = await root.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(data)
      await writable.close()
    } catch (e) {
      if (e instanceof Error && e.name === "SecurityError")
        throw new Error("This app does not work in private browsing mode")
    }
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
  return ext ? `${ext.toLowerCase()}` : ''
}

export const selectFile = async (): Promise<{id: string, uri: string}> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true
  })
  const asset = result.assets?.at(0)
  if (!asset) throw new Error("No file selected")
  const data = await getAssetData(asset)
  const ext = getFileExt(asset.name)
  const id = uuid()
  const fileName = `${id}.${ext}`
  const uri = await saveFile(fileName, data, 'document')
  return {id, uri}
}

export const loadBoard = async (uri: string): Promise<AACTree> => {
  const boardFile = await loadFile(uri)
  if (!boardFile) throw new Error('Could not load file')
  const ext = getFileExt(uri)
  let options = {}
  if (Platform.OS === "android" || Platform.OS === "ios") options = { zipAdapter }
  const processor = getProcessor(`.${ext}`, options)
  const tree = await processor.loadIntoTree(boardFile)
  return tree
}