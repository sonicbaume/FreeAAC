import { AACTree, getProcessor } from '@willwade/aac-processors/browser';
import * as DocumentPicker from 'expo-document-picker';
import { Paths } from 'expo-file-system';
import { ImagePickerOptions, launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { nanoid } from 'nanoid/non-secure';
import { getAssetData, getFileSize, isDirectory, listDir, loadFile, mkDir, mkTempDir, pathExists, removePath, saveFile } from './io';
import { BoardTree, TileImage } from './types';
import { uuid } from './uuid';

const fileAdapter = {
  readBinaryFromInput: async (input: string | Buffer | ArrayBuffer | Uint8Array): Promise<Uint8Array> => {
    if (typeof(input) === "string") {
      return await loadFile(input)
    } else if (input instanceof ArrayBuffer) {
      return new Uint8Array(input)
    } else {
      return input
    }
  },
  readTextFromInput: async (input: string | Buffer | ArrayBuffer | Uint8Array, encoding: BufferEncoding = 'utf-8'): Promise<string> => {
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
    await saveFile(outputPath, data)
  },
  writeTextToPath: async (outputPath: string, text: string): Promise<void> => {
    await saveFile(outputPath, new TextEncoder().encode(text))
  },
  pathExists,
  isDirectory,
  getFileSize,
  mkDir,
  listDir,
  removePath,
  mkTempDir,
  join: (...pathParts: string[]): string => Paths.join(...pathParts),
  dirname: (path: string): string => Paths.dirname(path),
  basename: (path: string, suffix?: string): string => Paths.basename(path, suffix)
}

export const getFileExt = (name: string): string => {
  const ext = name.split(".").pop()
  return ext ? `${ext.toLowerCase()}` : ''
}

export const selectFile = async (): Promise<{id: string, uri: string} | undefined> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true
  })
  const asset = result.assets?.at(0)
  if (!asset) return undefined
  const data = await getAssetData(asset)
  const ext = getFileExt(asset.name)
  const id = uuid()
  const fileName = `${id}.${ext}`
  const uri = await saveFile(fileName, data)
  return {id, uri}
}

export const selectImage = async (takePhoto: boolean): Promise<TileImage | undefined> =>
{
  const settings: ImagePickerOptions = {
    mediaTypes: ['images'],
    base64: true,
    exif: false
  }
  let result = takePhoto
    ? await launchCameraAsync(settings)
    : await launchImageLibraryAsync(settings)
  const file = result.assets?.at(0)
  if (!file) return undefined
  if (!file.base64) throw new Error('Could not read file data')
  const data = `data:${file.mimeType};base64,` + file.base64
  const id = nanoid()
  return {
    content_type: file.mimeType,
    data_url: data,
    id,
    path: file.fileName ?? `${id}.jpg`,
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

export const deleteBoard = async (uri: string) => {
  await removePath(uri)
}
