import * as Speech from 'expo-speech';
import { SpeechOptions } from 'expo-speech';

export const speak = (text: string, options: SpeechOptions) => {
  let speech = text.trim()
  if (speech === "I") speech = "i"  // avoid "capital I" output
  Speech.speak(speech, options)
}