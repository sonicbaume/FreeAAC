import { DocumentPickerAsset } from "expo-document-picker"
import { Paths } from "expo-file-system"

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
  const root = await navigator.storage.getDirectory()
  const dir = await root.getDirectoryHandle(path)
  const dirContents = []
  for await (const handle of dir.values()) {
    dirContents.push(handle.name)
  }
  return dirContents
}

export const removePath = async (
  path: string,
  options?: { recursive?: boolean; force?: boolean },
): Promise<void> => {
  const root = await navigator.storage.getDirectory()
  const dirname = Paths.dirname(path)
  const basename = Paths.basename(path)
  const dir = dirname === "." ? root : await root.getDirectoryHandle(dirname)
  await dir.removeEntry(basename, options)
}

export const mkTempDir = async (prefix: string): Promise<string> => {
  const root = await navigator.storage.getDirectory()
  const tempDir = await root.getDirectoryHandle(prefix, { create: true })
  return tempDir.name
}

export const getFileFromDocument = (asset: DocumentPickerAsset): File => {
  if (!asset.file) throw new Error("Could not read file")
  return asset.file
}

export const saveFile = async (
  fileName: string,
  data: Uint8Array,
): Promise<string> => {
  try {
    const dirname = Paths.dirname(fileName)
    const baseName = Paths.basename(fileName)
    const root = await navigator.storage.getDirectory()
    const dir =
      dirname === "." ? root : (
        await root.getDirectoryHandle(dirname, { create: true })
      )
    const fileHandle = await dir.getFileHandle(baseName, { create: true })
    const writable = await fileHandle.createWritable()
    await writable.write(data as BufferSource)
    await writable.close()
  } catch (e) {
    if (e instanceof Error && e.name === "SecurityError")
      throw new Error("This app does not work in private browsing mode", {
        cause: e,
      })
    throw e
  }
  return fileName
}

export const loadFile = async (fileName: string): Promise<Uint8Array> => {
  const dirname = Paths.dirname(fileName)
  const baseName = Paths.basename(fileName)
  const root = await navigator.storage.getDirectory()
  const dir = dirname === "." ? root : await root.getDirectoryHandle(dirname)
  const fileHandle = await dir.getFileHandle(baseName)
  const file = await fileHandle.getFile()
  return await file.bytes()
}

export const shareFile = async (file: File | Blob, name: string) => {
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
  }
}

export const saveFileAs = async (uri: string, name: string): Promise<void> => {
  const opfsRoot = await navigator.storage.getDirectory()
  const opfsFileHandle = await opfsRoot.getFileHandle(uri)
  const file = await opfsFileHandle.getFile()
  await shareFile(file, name)
}

export const saveObjectAs = async (
  data: unknown,
  name: string,
): Promise<void> => {
  const file = new Blob([JSON.stringify(data)], {
    type: "application/json",
  })
  shareFile(file, name)
}
