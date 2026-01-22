import { useLocales } from 'expo-localization';
import { getAvailableVoicesAsync } from "expo-speech";
import { Monitor, Speech } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import SettingsHeader from "./components/SettingsHeader";
import SettingsItem from "./components/SettingsItem";
import { useClearMessageOnPlay, useGoHomeOnPress, useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions, useSpeechOptions } from "./stores/prefs";
import { speak } from './utils/speech';

export default function Settings() {
  const playOnPress = usePlayOnPress()
  const messageWindowLocation = useMessageWindowLocation()
  const labelLocation = useLabelLocation()
  const speechOptions = useSpeechOptions()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const goHomeOnPress = useGoHomeOnPress()
  const locales = useLocales()
  const {
    togglePlayOnPress,
    setMessageWindowLocation,
    setLabelLocation,
    setSpeechOptions,
    toggleClearMessageOnPlay,
    toggleGoHomeOnPress
  } = usePrefsActions()
  const [voices, setVoices] = useState<{value: string, label: string}[]>([])

  const introduceVoice = (voice: string | undefined) => {
    const voiceObject = voices.find(v => v.value === voice)
    const name = voiceObject?.label.replace(/\(.*\)/, '')
    if (name) speak(`Hello, my name is ${name}`, {...speechOptions, voice})
  }

  useEffect(() => {(async () => {
    const languages = locales.map(l => l.languageTag)
    const allVoices = await getAvailableVoicesAsync()
    const localVoices = allVoices.filter(v => languages.includes(v.language))
    const voiceOptions = localVoices.map(v => { return {value: v.identifier, label: v.name} })
    setVoices(voiceOptions)
  })()}, [])

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        <SettingsHeader title="Speech" icon={Speech} />
        <SettingsItem
          title="Speak on press"
          description="Speak every time a button is pressed"
          type="toggle"
          value={playOnPress}
          setValue={togglePlayOnPress}
          labels={['Off', 'On']}
        />
        <SettingsItem
          title="Voice"
          description="The speaker's voice"
          type="select"
          value={speechOptions.voice}
          setValue={voice => {
            setSpeechOptions({voice})
            introduceVoice(voice)
          }}
          items={voices}
        />
        <SettingsItem
          title="Pitch"
          description="Pitch of the speaker's voice"
          type="slider"
          value={speechOptions.pitch}
          setValue={pitch => setSpeechOptions({pitch})}
          min={0}
          max={2}
          step={0.1}
        />
        <SettingsItem
          title="Rate"
          description="The rate of the speaker's speech"
          type="slider"
          value={speechOptions.rate}
          setValue={rate => setSpeechOptions({rate})}
          min={0}
          max={2}
          step={0.1}
        />
        <SettingsHeader title="Interface" icon={Monitor} />
        <SettingsItem
          title="Message window position"
          description="Choose where the message window appears"
          type="toggle"
          value={messageWindowLocation === "top"}
          setValue={val => setMessageWindowLocation(val ? "top" : "bottom")}
          labels={['Bottom', 'Top']}
        />
        <SettingsItem
          title="Label position"
          description="Choose where labels appear in relation to icons"
          type="toggle"
          value={labelLocation === "top"}
          setValue={val => setLabelLocation(val ? "top" : "bottom")}
          labels={['Below', 'Above']}
        />
        <SettingsItem
          title="Clear message on play"
          description="Clear the message once it has been played"
          type="toggle"
          value={clearMessageOnPlay}
          setValue={toggleClearMessageOnPlay}
        />
        <SettingsItem
          title="Go home on press"
          description="Go to the home page when a button is pressed"
          type="toggle"
          value={goHomeOnPress}
          setValue={toggleGoHomeOnPress}
        />
      </View>
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    height: '100%',
    width: 600,
    maxWidth: '100%',
    padding: 20
  }
})