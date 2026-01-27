import { SpeechOptions } from "../stores/prefs"
import { ExecuTorchTtsModel } from "./types"

export const useTts = (options: SpeechOptions): ExecuTorchTtsModel | undefined =>
{
  console.error("Not available on this platform")
  return undefined
}