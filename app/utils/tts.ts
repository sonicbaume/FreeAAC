import { SpeechOptions } from "../stores/prefs"

export const useTts = (options: SpeechOptions): any | undefined =>
{
  console.error("Not available on this platform")
  return undefined
}