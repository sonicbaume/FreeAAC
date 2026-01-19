


import { Platform } from "react-native";
import { handleError } from "./error";

export const saveFile = async (fileName: string, data: FileSystemWriteChunkType) => {
  if (Platform.OS !== "web") return handleError("Not yet supported on this platform")
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

export const loadFile = async (fileName: string): Promise<globalThis.File | undefined> => {
  if (Platform.OS !== "web") {
    handleError("Not yet supported on this platform")
    return undefined
  }
  const root = await navigator.storage.getDirectory();
  const fileHandle = await root.getFileHandle(fileName);
  return await fileHandle.getFile();
}
