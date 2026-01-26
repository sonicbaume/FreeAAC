import { KOKORO_MEDIUM, KOKORO_VOICE_AF_HEART, KOKORO_VOICE_AF_RIVER, KOKORO_VOICE_AF_SARAH, KOKORO_VOICE_AM_ADAM, KOKORO_VOICE_AM_MICHAEL, KOKORO_VOICE_AM_SANTA, KOKORO_VOICE_BF_EMMA, KOKORO_VOICE_BM_DANIEL, useTextToSpeech } from "react-native-executorch"
import { VoiceConfig } from "react-native-executorch/lib/typescript/types/tts"
import { SpeechOptions } from "../stores/prefs"

const kokoroVoiceMap: Record<string, VoiceConfig> = {
  af_heart: KOKORO_VOICE_AF_HEART,
  af_river: KOKORO_VOICE_AF_RIVER,
  af_sarah: KOKORO_VOICE_AF_SARAH,
  am_adam: KOKORO_VOICE_AM_ADAM,
  am_michael: KOKORO_VOICE_AM_MICHAEL,
  am_santa: KOKORO_VOICE_AM_SANTA,
  bf_emma: KOKORO_VOICE_BF_EMMA,
  bm_daniel: KOKORO_VOICE_BM_DANIEL
}

export const useTts = (options: SpeechOptions) => {
  return useTextToSpeech({
    model: KOKORO_MEDIUM,
    voice: options.voice ? kokoroVoiceMap[options.voice] : KOKORO_VOICE_AF_HEART,
    preventLoad: options.engine !== "kokoro"}
  )
}