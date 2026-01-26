import { SpeechOptions } from "../stores/prefs"

export const useTts = (options: SpeechOptions):
  { stream: (props: any) => Promise<void> } | undefined =>
{
  console.error("Not available on this platform")
  return undefined
}