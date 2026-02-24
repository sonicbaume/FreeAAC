import { DocumentPickerAsset } from "expo-document-picker"
import { Directory, File, Paths } from "expo-file-system"
import { nanoid } from "nanoid/non-secure"
import { getFileExt } from "./file"
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

export const mkDir = async (path: string, options?: { recursive?: boolean }): Promise<void> => {
  new Directory(path).create({
    intermediates: options?.recursive ?? false
  })
}

export const listDir = async (path: string): Promise<string[]> => {
  return new Directory(path).list().map(item => item.name)
}

export const removePath = async (path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void> => {
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

export const getAssetData = async (asset: DocumentPickerAsset):
  Promise<Uint8Array> =>
{
  const file = new File(asset.uri)
  if (!file) throw new Error("Could not read file")
  return await file.bytes()
}

export const saveFile = async (
  fileName: string,
  data: Uint8Array,
): Promise<string> => {
  const root = Paths.document
  const file = new File(root, fileName)
  console.log({root, fileName, uri: file.uri})
  file.create({ overwrite: true })
  file.write(data)
  return fileName
}

export const loadFile = async (fileName: string):
  Promise<Uint8Array> =>
{
  const root = Paths.document
  const file = new File(root, fileName)
  return await file.bytes()
}

export const downloadFile = async (url: string):
  Promise<{id: string, fileName: string}> =>
{
  const ext = getFileExt(url.split('/').slice(-1)[0])
  const id = uuid()
  const fileName = `${id}.${ext}`
  const destination = new File(Paths.document, fileName)
  await File.downloadFileAsync(url, destination)
  return { id, fileName }
}
