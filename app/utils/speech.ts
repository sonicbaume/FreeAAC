import { getAvailableVoicesAsync } from 'expo-speech';
import { SpeechEngine } from '../stores/prefs';
import { korokoVoices } from './consts';

const tagToCode = (langTag: string) => langTag.split(/[-_]+/)[0]
const harmoniseTag = (langTag: string) => langTag.replace('_','-')

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
