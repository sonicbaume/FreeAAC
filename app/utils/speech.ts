import * as Speech from 'expo-speech';
import { getAvailableVoicesAsync, SpeechOptions } from 'expo-speech';
import { SpeechOptions as Options, SpeechEngine } from '../stores/prefs';
import { korokoVoices } from './consts';

const tagToCode = (langTag: string) => langTag.split(/[-_]+/)[0]
const harmoniseTag = (langTag: string) => langTag.replace('_','-')

export const speak = async (text: string, options: SpeechOptions & Options, ttsSpeak: (text: string) => Promise<void>) => {
  let speech = text.trim()
  if (options.engine === "device") {
    if (speech === "I") speech = "i"  // avoid "capital I" output
    Speech.speak(speech, options)
  } else if (options.engine === "kokoro") {
    ttsSpeak(speech)
  } else {
    throw new Error("Invalid engine")
  }
}

export const getVoiceOptions = async (engine: SpeechEngine, deviceLangTags: string[], deviceLangCodes: string[]) => {
  const allVoices = (
    engine === "device" ? await getAvailableVoicesAsync() :
    engine === "kokoro" ? korokoVoices :
    [])
  const allVoiceLangTags = [...new Set(allVoices.map(l => l.language))]
  const allVoiceLangCodes = [...new Set(allVoices.map(l => tagToCode(l.language)))]
  const matchingLangTags = allVoiceLangTags.filter(l => deviceLangTags.includes(harmoniseTag(l)))
  const matchingLangCodes = allVoiceLangCodes.filter(l => deviceLangCodes.includes(harmoniseTag(l)))
  let localVoices = allVoices.filter(v => matchingLangTags.includes(v.language))
  if (localVoices.length < 2) localVoices = allVoices.filter(v => matchingLangCodes.includes(tagToCode(v.language)))
  if (localVoices.length < 2) localVoices = allVoices
  return localVoices.map(v => { return {value: v.identifier, label: v.name, langTag: v.language} })
}
