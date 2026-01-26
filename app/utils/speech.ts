import * as Speech from 'expo-speech';
import { getAvailableVoicesAsync, SpeechOptions, Voice } from 'expo-speech';
import { SpeechEngine } from '../stores/prefs';

const tagToCode = (langTag: string) => langTag.split(/[-_]+/)[0]
const harmoniseTag = (langTag: string) => langTag.replace('_','-')

const korokoVoices: Pick<Voice, 'identifier' | 'name' | 'language'>[] = [
  {
    identifier: 'af_heart',
    name: 'Heart',
    language: 'en-US'
  }, {
    identifier: 'af_river',
    name: 'River',
    language: 'en-US'
  }, {
    identifier: 'af_sarah',
    name: 'Sarah',
    language: 'en-US'
  }, {
    identifier: 'am_adam',
    name: 'Adam',
    language: 'en-US'
  }, {
    identifier: 'am_michael',
    name: 'Michael',
    language: 'en-US'
  }, {
    identifier: 'am_santa',
    name: 'Santa',
    language: 'en-US'
  }, {
    identifier: 'bf_emma',
    name: 'Emma',
    language: 'en-GB'
  }, {
    identifier: 'bm_daniel',
    name: 'Daniel',
    language: 'en-GB'
  }
]

export const speak = (text: string, options: SpeechOptions) => {
  let speech = text.trim()
  if (speech === "I") speech = "i"  // avoid "capital I" output
  Speech.speak(speech, options)
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
