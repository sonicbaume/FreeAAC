import { KOKORO_MEDIUM, KOKORO_VOICE_AF_HEART, useTextToSpeech } from "react-native-executorch"
import { SpeechEngine } from "../stores/prefs"

export const useTts = (engine: SpeechEngine) => {
  return useTextToSpeech({
    model: KOKORO_MEDIUM,
    voice: KOKORO_VOICE_AF_HEART,
    preventLoad: engine !== "kokoro"}
  )
}