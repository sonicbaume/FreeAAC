import { DocumentPickerAsset } from "expo-document-picker"
import { Directory, File, Paths } from "expo-file-system"
import { shareAsync } from "expo-sharing"
import { nanoid } from "nanoid/non-secure"
import { getFileExt, getFileType } from "./file"
import { uuid } from "./uuid"

export const pathExists = async (path: string): Promise<boolean> => {
  return Paths.info(Paths.join(Paths.document, path)).exists
}

export const isDirectory = async (path: string): Promise<boolean> => {
  return Paths.info(Paths.join(Paths.document, path)).isDirectory ?? false
}

export const getFileSize = async (path: string): Promise<number> => {
  return new File(path).size
}

export const mkDir = async (
  path: string,
  options?: { recursive?: boolean },
): Promise<void> => {
  new Directory(path).create({
    intermediates: options?.recursive ?? false,
  })
}

export const listDir = async (path: string): Promise<string[]> => {
  return new Directory(path).list().map((item) => item.name)
}

export const removePath = async (
  path: string,
  options?: { recursive?: boolean; force?: boolean },
): Promise<void> => {
  const resolvedPath = Paths.join(Paths.document, path)
  if (Paths.info(resolvedPath).isDirectory) {
    new Directory(resolvedPath).delete()
  } else {
    new File(resolvedPath).delete()
  }
}

export const mkTempDir = async (prefix: string): Promise<string> => {
  const tempDir = new Directory(Paths.cache, prefix, nanoid())
  tempDir.create()
  return tempDir.name
}

export const getFileFromDocument = (asset: DocumentPickerAsset): File => {
  const file = new File(asset.uri)
  if (!file) throw new Error("Could not read file")
  return file
}

export const saveFile = async (
  fileName: string,
  data: Uint8Array,
): Promise<string> => {
  const root = Paths.document
  const file = new File(root, fileName)
  console.log({ root, fileName, uri: file.uri })
  file.create({ overwrite: true })
  file.write(data)
  return fileName
}

export const loadFile = async (fileName: string): Promise<Uint8Array> => {
  const root = Paths.document
  const file = new File(root, fileName)
  return await file.bytes()
}

export const downloadFile = async (
  url: string,
): Promise<{ id: string; fileName: string }> => {
  const ext = getFileExt(url.split("/").slice(-1)[0])
  const id = uuid()
  const fileName = `${id}.${ext}`
  const destination = new File(Paths.document, fileName)
  await File.downloadFileAsync(url, destination)
  return { id, fileName }
}

export const saveAs = async (uri: string | Blob, name: string) => {
  let file
  if (typeof uri === "string") {
    const resolvedPath = Paths.join(Paths.document, uri)
    file = new File(resolvedPath)
  } else {
    file = new File(Paths.cache, name)
    file.create({ overwrite: true })
    const data = await uri.bytes()
    file.write(data)
  }
  const ext = getFileExt(name)
  const { mimeType, UTI } = getFileType(ext)
  await shareAsync(file.uri, { mimeType, UTI })
}

export const shareFile = async (file: File, name: string) => {
  const ext = getFileExt(name)
  const { mimeType, UTI } = getFileType(ext)
  await shareAsync(file.uri, { mimeType, UTI })
}

export const saveFileAs = async (uri: string, name: string): Promise<void> => {
  const resolvedPath = Paths.join(Paths.document, uri)
  const file = new File(resolvedPath)
  await shareFile(file, name)
}

export const saveObjectAs = async (
  data: unknown,
  name: string,
): Promise<void> => {
  const file = new File(Paths.cache, name)
  file.create({ overwrite: true })
  file.write(JSON.stringify(data))
  shareFile(file, name)
}
