import { DocumentPickerAsset } from "expo-document-picker"
import { getFileExt } from "./file"
import { uuid } from "./uuid"

export const pathExists = async (path: string): Promise<boolean> => {
  const root = await navigator.storage.getDirectory()
  try {
    await root.getFileHandle(path)
    return true
  } catch (e) {
    if (e instanceof TypeError) {
      try {
        await root.getDirectoryHandle(path)
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

export const isDirectory = async (path: string): Promise<boolean> => {
  const root = await navigator.storage.getDirectory()
  try {
    await root.getDirectoryHandle(path)
    return true
  } catch {
    return false
  }
}

export const getFileSize = async (path: string): Promise<number> => {
  const root = await navigator.storage.getDirectory()
  const fileHandle = await root.getFileHandle(path)
  const file = await fileHandle.getFile()
  return file.size
}

export const mkDir = async (
  path: string,
  options?: { recursive?: boolean },
): Promise<void> => {
  const root = await navigator.storage.getDirectory()
  await root.getDirectoryHandle(path, { create: true })
}

export const listDir = async (path: string): Promise<string[]> => {
  throw new Error("listDir not available on web")
}

export const removePath = async (
  path: string,
  options?: { recursive?: boolean; force?: boolean },
): Promise<void> => {
  const root = await navigator.storage.getDirectory()
  await root.removeEntry(path)
}

export const mkTempDir = async (prefix: string): Promise<string> => {
  const root = await navigator.storage.getDirectory()
  const tempDir = await root.getDirectoryHandle(prefix, { create: true })
  return tempDir.name
}

export const getAssetData = async (
  asset: DocumentPickerAsset,
): Promise<Uint8Array> => {
  if (!asset.file) throw new Error("Could not read file")
  return await asset.file.bytes()
}

export const saveFile = async (
  fileName: string,
  data: Uint8Array,
): Promise<string> => {
  try {
    const root = await navigator.storage.getDirectory()
    const fileHandle = await root.getFileHandle(fileName, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(data as BufferSource)
    await writable.close()
  } catch (e) {
    if (e instanceof Error && e.name === "SecurityError")
      throw new Error("This app does not work in private browsing mode", {
        cause: e,
      })
  }
  return fileName
}

export const loadFile = async (fileName: string): Promise<Uint8Array> => {
  const root = await navigator.storage.getDirectory()
  const fileHandle = await root.getFileHandle(fileName)
  const file = await fileHandle.getFile()
  return await file.bytes()
}

export const downloadFile = async (
  url: string,
): Promise<{ id: string; fileName: string }> => {
  const ext = getFileExt(url.split("/").slice(-1)[0])
  const id = uuid()
  const fileName = `${id}.${ext}`
  const response = await fetch(url)
  const data = await response.bytes()
  await saveFile(fileName, data)
  return { id, fileName }
}

export const saveAs = async (uri: string, name: string) => {
  const opfsRoot = await navigator.storage.getDirectory()
  const opfsFileHandle = await opfsRoot.getFileHandle(uri)
  const file = await opfsFileHandle.getFile()

  if ("showSaveFilePicker" in window) {
    //@ts-expect-error Only supported in Chrome
    const localHandle = await window.showSaveFilePicker({ suggestedName: name })
    const writable = await localHandle.createWritable()
    await file.stream().pipeTo(writable)
  } else {
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    a.click()
    // URL.revokeObjectURL(url)
  }
}
