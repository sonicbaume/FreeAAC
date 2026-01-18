import * as Speech from 'expo-speech';

export const speak = (text: string) => {
  let speech = text.trim()
  if (speech === "I") speech = "i"  // avoid "capital I" output
  Speech.speak(speech)
}