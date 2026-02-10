


import { AACTree, getProcessor } from '@willwade/aac-processors/browser';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { nanoid } from 'nanoid/non-secure';
import { Platform } from "react-native";
import { BoardTree } from './types';
import { uuid } from './uuid';

const fileAdapter = {
  readBinaryFromInput: (input: string | Buffer | ArrayBuffer | Uint8Array): Uint8Array => {
    console.log("READING USING ADAPTER")
    if (typeof(input) === "string") {
      return new File(input).bytesSync()
    } else if (input instanceof ArrayBuffer) {
      return new Uint8Array(input)
    } else {
      return input
    }
  },
  readTextFromInput: (input: string | Buffer | ArrayBuffer | Uint8Array, encoding: BufferEncoding = 'utf-8'): string => {
    console.log("READING USING ADAPTER")
    if (typeof input === 'string') {
      return new File(input).textSync()
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
      return input.toString(encoding);
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
        return input.toString('utf8');
    } else {
      return new TextDecoder(encoding).decode(input);
    }
  },
  writeBinaryToPath: (outputPath: string, data: Uint8Array): void => {
    console.log("WRITING USING ADAPTER")
    saveFile(outputPath, data, 'document')
  },
  writeTextToPath: (outputPath: string, text: string): void => {
    console.log("WRITING USING ADAPTER")
    saveFile(outputPath, new TextEncoder().encode(text), 'document')
  },
  pathExists: (path: string): boolean => {
    return Paths.info(path).exists
  },
  isDirectory: (path: string): boolean => {
    return Paths.info(path).isDirectory ?? false
  },
  getFileSize: (path: string): number => {
    return new File(path).size
  },
  mkDir: (path: string, options?: { recursive?: boolean }): void => {
    new Directory(path).create({
      intermediates: options?.recursive ?? false
    })
  },
  listDir: (path: string): string[] => {
    return new Directory(path).list().map(item => item.name)
  },
  removePath: (path: string, options?: { recursive?: boolean; force?: boolean }): void => {
    if (Paths.info(path).isDirectory) {
      new Directory(path).delete()
    } else {
      new File(path).delete()
    }
  },
  mkTempDir: (prefix: string): string => {
    const tempDir = new Directory(Paths.cache, prefix, nanoid())
    tempDir.create()
    return tempDir.name
  },
  join: (...pathParts: string[]): string => {
    return Paths.join(...pathParts)
  },
  dirname: (path: string): string => {
    return Paths.dirname(path)
  },
  basename: (path: string, suffix?: string): string => {
    return Paths.basename(path, suffix)
  }
}

export const saveFile = async (
  fileName: string,
  data: Uint8Array,
  storageType: 'document' | 'cache'
): Promise<string> => {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const root = storageType === 'cache' ? Paths.cache : Paths.document
    const file = new File(root, fileName)
    file.uri
    file.create()
    file.write(data)
    return file.uri
  } else if (Platform.OS === "web") {
    try {
      const root = await navigator.storage.getDirectory()
      const fileHandle = await root.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(data as BufferSource)
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
  Promise<Uint8Array> =>
{
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const file = new File(fileName)
    return await file.bytes()
  } else if (Platform.OS === "web") {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(fileName)
    const file = await fileHandle.getFile()
    return await file.bytes()
  } else {
    throw "File load not yet supported on this platform"
  }
}

const getAssetData = async (asset: DocumentPicker.DocumentPickerAsset):
  Promise<Uint8Array> =>
{
  const file = Platform.OS === "web" ? asset.file : new File(asset.uri)
  if (!file) throw new Error("Could not read file")
  return await file.bytes()
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

export const loadBoard = async (uri: string): Promise<BoardTree> => {
  const boardFile = await loadFile(uri)
  if (!boardFile) throw new Error('Could not load file')
  const ext = getFileExt(uri)
  const options = (Platform.OS === "android" || Platform.OS === "ios") ? { fileAdapter } : undefined
  const processor = getProcessor(`.${ext}`, options)
  const tree = await processor.loadIntoTree(boardFile)
  return tree
}

export const saveBoard = async (uri: string, tree: BoardTree) => {
  const ext = getFileExt(uri)
  const processor = getProcessor(`.${ext}`, { fileAdapter })
  await processor.saveFromTree(tree as unknown as AACTree, uri)
}