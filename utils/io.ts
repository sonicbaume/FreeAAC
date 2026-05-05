import { DocumentPickerAsset } from "expo-document-picker";

const parsePath = async (
  path: string,
  options?: { create: boolean },
): Promise<{ dir: FileSystemDirectoryHandle; filename: string }> => {
  let dir = await navigator.storage.getDirectory()
  const pathParts = path.split("/").filter((part) => part.length > 0)
  const filename = pathParts.pop()
  if (!filename) throw new Error("Invalid filepath")
  for (const folderName of pathParts) {
    dir = await dir.getDirectoryHandle(folderName, options)
  }
  return { dir, filename }
}

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
  const { dir, filename } = await parsePath(path)
  await dir.getDirectoryHandle(filename, { create: true })
}

export const listDir = async (path: string): Promise<string[]> => {
  const root = await navigator.storage.getDirectory()
  const dir = await root.getDirectoryHandle(path)
  const dirContents = []
  for await (const handle of Object.values(dir)) {
    dirContents.push(handle.name)
  }
  return dirContents
}

export const removePath = async (
  path: string,
  options?: { recursive?: boolean; force?: boolean },
): Promise<void> => {
  const { dir, filename } = await parsePath(path)
  await dir.removeEntry(filename, options)
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
  path: string,
  data: Uint8Array,
): Promise<string> => {
  try {
    const { dir, filename } = await parsePath(path, { create: true })
    const fileHandle = await dir.getFileHandle(filename, { create: true })
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
  return path
}

export const loadFile = async (path: string): Promise<Uint8Array> => {
  const { dir, filename } = await parsePath(path)
  const fileHandle = await dir.getFileHandle(filename)
  const file = await fileHandle.getFile()
  return await file.bytes()
}

export const shareFile = async (file: File, name: string) => {
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
  const file = new File([JSON.stringify(data)], name, {
    type: "application/json",
  })
  shareFile(file, name)
}
