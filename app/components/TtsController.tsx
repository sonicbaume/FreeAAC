import { useEffect } from "react";
import { KOKORO_MEDIUM, KOKORO_VOICE_AF_HEART, useTextToSpeech } from "react-native-executorch";
import { useSetTtsModel } from "../stores/tts";

export default function TtsController () {
  const setTtsModel = useSetTtsModel()
  const tts = useTextToSpeech({model: KOKORO_MEDIUM, voice: KOKORO_VOICE_AF_HEART})
  useEffect(() => setTtsModel(tts), [tts, setTtsModel])
  return null
};
