import { HistoryEntry } from "@willwade/aac-processors/analytics"
import {
  AACPage,
  AACTree,
  getProcessor,
  ObfProcessor,
} from "@willwade/aac-processors/browser"
import { OblUtil } from "@willwade/aac-processors/metrics"
import * as DocumentPicker from "expo-document-picker"
import { Paths } from "expo-file-system"
import {
  ImagePickerOptions,
  launchCameraAsync,
  launchImageLibraryAsync,
} from "expo-image-picker"
import { fetch } from "expo/fetch"
import { nanoid } from "nanoid/non-secure"
import { PageItem } from "../stores/boards"
import { appName } from "./consts"
import {
  getFileFromDocument,
  getFileSize,
  isDirectory,
  listDir,
  loadFile,
  mkDir,
  mkTempDir,
  pathExists,
  removePath,
  saveFile,
  saveFileAs,
  saveObjectAs,
} from "./io"
import { BoardPage, BoardTree, TileImage } from "./types"
import { uuid } from "./uuid"

type ObfManifest = {
  format?: string
  root?: string
  paths?: {
    boards?: { [key: string]: string }
    images?: { [key: string]: string }
    sounds?: { [key: string]: string }
  }
}

const cachedPages: Record<string, BoardPage> = {}

const fileAdapter = {
  readBinaryFromInput: async (
    input: string | Buffer | ArrayBuffer | Uint8Array,
  ): Promise<Uint8Array> => {
    if (typeof input === "string") {
      return await loadFile(input)
    } else if (input instanceof ArrayBuffer) {
      return new Uint8Array(input)
    } else {
      return input
    }
  },
  readTextFromInput: async (
    input: string | Buffer | ArrayBuffer | Uint8Array,
    encoding: BufferEncoding = "utf-8",
  ): Promise<string> => {
    if (typeof input === "string") {
      const data = await loadFile(input)
      return new TextDecoder(encoding).decode(data)
    } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) {
      return input.toString(encoding)
    } else {
      return new TextDecoder(encoding).decode(input)
    }
  },
  writeBinaryToPath: async (
    outputPath: string,
    data: Uint8Array,
  ): Promise<void> => {
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
  basename: (path: string, suffix?: string): string =>
    Paths.basename(path, suffix),
}

export const getFileExt = (name: string): string => {
  const ext = name.split(".").pop()
  return ext ? `${ext.toLowerCase()}` : ""
}

export const getFileType = (ext: string): { mimeType: string; UTI: string } => {
  switch (ext) {
    case "json":
    case "obf":
    case "obl":
    case "grd":
      return { mimeType: "application/json", UTI: "public.json" }
    case "obz":
    case "gridset":
    case "spb":
    case "sps":
      return { mimeType: "application/zip", UTI: "public.zip-archive" }
    case "dot":
      return { mimeType: "text/vnd.graphviz", UTI: "public.data" }
    case "opml":
      return { mimeType: "application/xml", UTI: "public.xml" }
    case "ce":
      return { mimeType: "application/octet-stream", UTI: "public.data" }
    case "plist":
      return { mimeType: "application/x-plist", UTI: "com.apple.property-list" }
    default:
      throw new Error(`Unknown file extension: ${ext}`)
  }
}

type ProcessedBoard = {
  id: string
  name: string
  pages: PageItem[]
  rootPage: string
}

const processImportedBoard = async (
  tree: BoardTree,
): Promise<ProcessedBoard> => {
  const id = uuid()
  await saveBoard(id, tree)

  const manifest = await loadManifest(id)
  if (!manifest.root) throw new Error("No root page in manifest")
  const name = tree.metadata?.name ?? "Untitled board"
  const rootPage = manifest.root

  const pages = Object.entries<BoardPage>(tree.pages).map(([id, page]) => {
    if (!manifest.paths?.boards) throw new Error("No boards in manifest")
    return {
      id,
      name: page.name,
      path: manifest.paths.boards[id],
    }
  })

  return { id, name, pages, rootPage }
}

export const importBoardFile = async (): Promise<
  ProcessedBoard | undefined
> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  })

  const asset = result.assets?.at(0)
  if (!asset) return undefined

  const file = getFileFromDocument(asset)
  const data = await file.bytes()
  const ext = getFileExt(asset.name)
  const tree = await loadBoard(data, ext)

  return processImportedBoard(tree)
}

export const importBoard = async (url: string): Promise<ProcessedBoard> => {
  const ext = getFileExt(url.split("/").slice(-1)[0])
  const response = await fetch(url)
  const data = await response.bytes()
  const tree = await loadBoard(data, ext)

  return processImportedBoard(tree)
}

export const importPrefsFile = async (): Promise<unknown> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  })
  const asset = result.assets?.at(0)
  if (!asset) return undefined
  const file = getFileFromDocument(asset)
  const text = await file.text()
  return JSON.parse(text)
}

export const selectImage = async (
  takePhoto: boolean,
): Promise<TileImage | undefined> => {
  const settings: ImagePickerOptions = {
    mediaTypes: ["images"],
    base64: true,
    exif: false,
  }
  const result =
    takePhoto ?
      await launchCameraAsync(settings)
    : await launchImageLibraryAsync(settings)
  const file = result.assets?.at(0)
  if (!file) return undefined
  if (!file.base64) throw new Error("Could not read file data")
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

export const loadManifest = async (id: string): Promise<ObfManifest> => {
  const data = await fileAdapter.readTextFromInput(`${id}/manifest.json`)
  const manifest = JSON.parse(data) as ObfManifest
  if (!manifest.root) throw new Error("Could not find root in manifest")
  if (!manifest.paths) throw new Error("Could not find paths in manifest")
  if (!manifest.paths.boards)
    throw new Error("Could not find boards in manifest")
  return manifest
}

export const saveManifest = async (id: string, manifest: ObfManifest) => {
  fileAdapter.writeTextToPath(`${id}/manifest.json`, JSON.stringify(manifest))
}

export const saveRootPageId = async (boardId: string, pageId: string) => {
  const manifest = await loadManifest(boardId)
  if (!manifest.paths?.boards)
    throw new Error("Could not load manifest - no boards listed")
  if (!manifest.paths?.boards[pageId])
    throw new Error("Could not find page in manifest")
  manifest.root = pageId
  await saveManifest(boardId, manifest)
}

export const loadPage = async (
  boardId: string,
  pageId: string,
  path: string,
): Promise<BoardPage> => {
  const cacheName = `${boardId}/${pageId}`
  if (cacheName in cachedPages) return cachedPages[cacheName]
  const processor = new ObfProcessor({ fileAdapter })
  const tree = await processor.loadIntoTree(`${boardId}/${path}`)
  cachedPages[cacheName] = tree.pages[pageId]
  return tree.pages[pageId]
}

export const loadBoard = async (
  input: string | Uint8Array,
  ext = "obf",
): Promise<BoardTree> => {
  const processor = getProcessor(`.${ext}`, { fileAdapter })
  const tree = await processor.loadIntoTree(input)
  return tree as unknown as BoardTree
}

export const saveBoard = async (id: string, tree: BoardTree) => {
  console.log(`Saving board ${id}`)
  const processor = new ObfProcessor({ fileAdapter })
  const newTree = new AACTree()
  const newPages: Record<string, AACPage> = {}
  Object.keys(tree.pages).forEach((k) => {
    newPages[k] = new AACPage(tree.pages[k])
  })
  Object.assign(newTree, tree, { pages: newPages })
  await processor.saveFromTree(newTree, id, true)
}

export const saveBoardPage = async (
  boardId: string,
  pageId: string,
  page: BoardPage,
  path: string,
) => {
  const cacheName = `${boardId}/${pageId}`
  delete cachedPages[cacheName]
  const tree = {
    metadata: {},
    pages: {
      [pageId]: page,
    },
  } as BoardTree
  await saveBoard(`${boardId}/${path}`, tree)
}

export const deleteBoard = async (id: string) => {
  await removePath(id, { recursive: true })
}

export const exportBoard = async (id: string, name: string, ext: string) => {
  const fileName = `${id}.${ext}`
  const tree = await loadBoard(id)
  await saveBoard(fileName, tree)
  await saveFileAs(fileName, `${name}.${ext}`)
}

export const exportLogs = async (entries: HistoryEntry[]) => {
  for (const entry of entries) {
    for (const occurance of entry.occurrences) {
      occurance.timestamp = new Date(occurance.timestamp)
    }
  }
  const oblObject = OblUtil.fromHistoryEntries(entries, "user", appName)
  await saveObjectAs(oblObject, `${appName}_logs.obl`)
}
