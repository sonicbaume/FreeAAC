import { SpeechEngine } from "../stores/prefs"

export const useTts = (engine: SpeechEngine):
  { stream: (props: any) => Promise<void> } | undefined =>
{
  console.error("Not available on this platform")
  return undefined
}