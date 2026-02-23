import { AACTree, getProcessor } from '@willwade/aac-processors/browser';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import { nanoid } from 'nanoid/non-secure';
import { Platform } from "react-native";
import { BoardTree, TileImage } from './types';
import { uuid } from './uuid';

const fileAdapter = {
  readBinaryFromInput: async (input: string | Buffer | ArrayBuffer | Uint8Array): Promise<Uint8Array> => {
    console.log("READING USING ADAPTER")
    if (typeof(input) === "string") {
      return await loadFile(input)
    } else if (input instanceof ArrayBuffer) {
      return new Uint8Array(input)
    } else {
      return input
    }
  },
  readTextFromInput: async (input: string | Buffer | ArrayBuffer | Uint8Array, encoding: BufferEncoding = 'utf-8'): Promise<string> => {
    console.log("READING USING ADAPTER")
    if (typeof input === 'string') {
      const data = await loadFile(input)
      return new TextDecoder(encoding).decode(data)
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
      return input.toString(encoding);
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(input)) {
        return input.toString('utf8');
    } else {
      return new TextDecoder(encoding).decode(input);
    }
  },
  writeBinaryToPath: async (outputPath: string, data: Uint8Array): Promise<void> => {
    console.log("WRITING USING ADAPTER")
    await saveFile(outputPath, data)
  },
  writeTextToPath: async (outputPath: string, text: string): Promise<void> => {
    console.log("WRITING USING ADAPTER")
    await saveFile(outputPath, new TextEncoder().encode(text))
  },
  pathExists: async (path: string): Promise<boolean> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return Paths.info(Paths.join(Paths.document, path)).exists
    } else {
      const root = await navigator.storage.getDirectory()
      try {
        const fileHandle = await root.getFileHandle(path)
        return true
      } catch (e) {
        if (e instanceof TypeError) {
          try {
            const dirHandle = await root.getDirectoryHandle(path)
            return true
          } catch (e) {
            return false
          }
        }
        return false
      }
    }
  },
  isDirectory: async (path: string): Promise<boolean> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return Paths.info(Paths.join(Paths.document, path)).isDirectory ?? false
    } else {
      const root = await navigator.storage.getDirectory()
      try {
        const dirHandle = await root.getDirectoryHandle(path)
        return true
      } catch (e) {
        return false
      }
    }
  },
  getFileSize: async (path: string): Promise<number> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return new File(path).size
    } else {
      const root = await navigator.storage.getDirectory()
      const fileHandle = await root.getFileHandle(path)
      const file = await fileHandle.getFile()
      return file.size
    }
  },
  mkDir: async (path: string, options?: { recursive?: boolean }): Promise<void> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      new Directory(path).create({
        intermediates: options?.recursive ?? false
      })
    } else {
      const root = await navigator.storage.getDirectory()
      await root.getDirectoryHandle(path, { create: true })
    }
  },
  listDir: async (path: string): Promise<string[]> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      return new Directory(path).list().map(item => item.name)
    } else {
      throw new Error('listDir not available on web')
    }
  },
  removePath: async (path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const resolvedPath = Paths.join(Paths.document, path)
      if (Paths.info(resolvedPath).isDirectory) {
        new Directory(resolvedPath).delete()
      } else {
        new File(resolvedPath).delete()
      }
    } else {
      const root = await navigator.storage.getDirectory()
      await root.removeEntry(path)
    }
  },
  mkTempDir: async (prefix: string): Promise<string> => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      const tempDir = new Directory(Paths.cache, prefix, nanoid())
      tempDir.create()
      return tempDir.name
    } else {
      const root = await navigator.storage.getDirectory()
      const tempDir = await root.getDirectoryHandle(nanoid(), { create: true })
      return tempDir.name
    }
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
): Promise<string> => {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    const root = Paths.document
    const file = new File(root, fileName)
    console.log({root, fileName, uri: file.uri})
    file.create({ overwrite: true })
    file.write(data)
    return fileName
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
    const root = Paths.document
    const file = new File(root, fileName)
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

export const downloadFile = async (url: string):
  Promise<{id: string, fileName: string}> => {
  const ext = getFileExt(url.split('/').slice(-1)[0])
  const id = uuid()
  const fileName = `${id}.${ext}`
  if (Platform.OS === "web") {
    const response = await fetch(url)
    const data = await response.bytes()
    await saveFile(fileName, data)
  } else {
    const destination = new File(Paths.document, fileName)
    await File.downloadFileAsync(url, destination)
  }
  return { id, fileName }
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
  const uri = await saveFile(fileName, data)
  return {id, uri}
}

export const selectImage = async (): Promise<TileImage> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'image/*'
  })
  const file = result.assets?.at(0)
  if (!file) throw new Error('Could not read file')
  if (!file.mimeType?.startsWith('image/')) throw new Error('File must be an image')
  const data = Platform.OS === "web"
    ? file.base64
    : `data:${file.mimeType};base64,` + await new File(file.uri).base64()
  if (!data) throw new Error('Could not read file data')
  return {
    content_type: file.mimeType,
    data_url: data,
    id: nanoid(),
    path: file.name,
    url: data,
  }
}

export const loadBoard = async (uri: string): Promise<BoardTree> => {
  const boardFile = await loadFile(uri)
  if (!boardFile) throw new Error('Could not load file')
  const ext = getFileExt(uri)
  const processor = getProcessor(`.${ext}`, { fileAdapter })
  const tree = await processor.loadIntoTree(boardFile)
  return tree
}

export const saveBoard = async (uri: string, tree: BoardTree) => {
  console.log(`Saving to ${uri}`)
  const ext = getFileExt(uri)
  const processor = getProcessor(`.${ext}`, { fileAdapter })
  await processor.saveFromTree(tree as unknown as AACTree, uri)
}