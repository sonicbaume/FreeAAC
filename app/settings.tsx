import * as Application from 'expo-application';
import { useAssets } from 'expo-asset';
import { Image } from 'expo-image';
import { useLocales } from 'expo-localization';
import { Link } from 'expo-router';
import { getAvailableVoicesAsync } from 'expo-speech';
import { Bug, Info, Lightbulb, Monitor, Shield, Speech } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import GithubIcon from './components/Icons/Github';
import SettingsHeader from "./components/Settings/Header";
import SettingsItem from "./components/Settings/Item";
import LinkButton from './components/Settings/LinkButton';
import PreviewButton from './components/Settings/PreviewButton';
import TtsStatus from './components/Settings/TtsStatus';
import { useSpeak } from './stores/audio';
import { ButtonViewOption, buttonViewOptions, SpeechEngine, speechEngines, useButtonView, useClearMessageOnPlay, useGoHomeOnPress, useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions, useShowBackspace, useShowShareButton, useSpeechOptions } from "./stores/prefs";
import { korokoVoices } from './utils/consts';
import { handleError } from './utils/error';
import { FONT_SIZE, GAP, ICON_SIZE, MAX_WIDTH, PADDING, useTheme } from './utils/theme';

const tagToCode = (langTag: string) => langTag.split(/[-_]+/)[0]
const harmoniseTag = (langTag: string) => langTag.replace('_','-')

export const getVoiceOptions = async (engine: SpeechEngine, deviceLangCodes: string[]) => {
  const allVoices = (
    engine === "device" ? await getAvailableVoicesAsync() :
    engine === "kokoro" ? korokoVoices :
    [])
  const allVoiceLangCodes = [...new Set(allVoices.map(l => tagToCode(l.language)))]
  const matchingLangCodes = allVoiceLangCodes.filter(l => deviceLangCodes.includes(harmoniseTag(l)))
  let localVoices = allVoices.filter(v => matchingLangCodes.includes(tagToCode(v.language)))
  if (localVoices.length < 2) localVoices = allVoices
  return localVoices.map(v => { return {value: v.identifier, label: v.name, langTag: v.language} })
}

const buttonViewLabels: Record<ButtonViewOption, string> = {
  'both': 'Symbol and text',
  'symbol': 'Symbol only',
  'text': 'Text only'
}
const speechEngineLabels: Record<SpeechEngine, string> = {
  'device': '🤖 System TTS',
  'kokoro': Platform.OS === 'web' ? '✨ Neural TTS (mobile only)' : '✨ Neural TTS'
}

export default function Settings() {
  const theme = useTheme()
  const [assets, error] = useAssets([require('../assets/images/icon-64x64.png')])
  const appVersion = Application.nativeApplicationVersion
  const playOnPress = usePlayOnPress()
  const messageWindowLocation = useMessageWindowLocation()
  const labelLocation = useLabelLocation()
  const buttonView = useButtonView()
  const speechOptions = useSpeechOptions()
  const clearMessageOnPlay = useClearMessageOnPlay()
  const goHomeOnPress = useGoHomeOnPress()
  const showShareButton = useShowShareButton()
  const showBackspace = useShowBackspace()
  const locales = useLocales()
  const {
    togglePlayOnPress,
    setMessageWindowLocation,
    setLabelLocation,
    setButtonView,
    setSpeechOptions,
    toggleClearMessageOnPlay,
    toggleGoHomeOnPress,
    toggleShowShareButton,
    toggleShowBackspace
  } = usePrefsActions()
  const [voices, setVoices] = useState<{value: string, label: string, langTag: string}[]>([])
  const speak = useSpeak()

  const styles = StyleSheet.create({
    container: {
      width: MAX_WIDTH,
      maxWidth: '100%',
      padding: PADDING.xl,
      marginHorizontal: 'auto',
      backgroundColor: theme.surface,
    }
  })

  const introduceVoice = (voice: string | undefined) => {
    const voiceObject = voices.find(v => v.value === voice)
    const name = voiceObject?.label.replace(/\(.*\)/, '')
    if (name) speak(`Hi there! My name is ${name}`, {voice: voiceObject?.value})
  }
  const introduceRate = () => speak("This is how fast I talk")
  const introducePitch = () => speak("This is the pitch of my voice")

  useEffect(() => {(async () => {
    const deviceLangCodes  = [...new Set(locales.map(l => l.languageCode))].filter(l => l !== null)
    const voiceOptions = await getVoiceOptions(speechOptions.engine, deviceLangCodes)
    setVoices(voiceOptions)

    if (speechOptions.voice === undefined ||
      voiceOptions.find(v => v.value === speechOptions.voice) === undefined) {
      setSpeechOptions({voice: voiceOptions[0].value})
    }
  })()}, [locales, speechOptions.engine])

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={{...styles.container, paddingBottom: 200}}>
        <SettingsHeader title="Speech" icon={Speech} />
        <SettingsItem
          title="Engine"
          description="Text-to-speech engine"
          type="select"
          value={speechOptions.engine}
          setValue={engine => {
            if (engine !== "device" && Platform.OS === "web") {
              return handleError("Unavailable on this platform")
            }
            setSpeechOptions({engine})
          }}
          items={speechEngines.map(value => {return { label: speechEngineLabels[value], value }})}
        />
        {speechOptions.engine === "kokoro" && <TtsStatus />}
        <SettingsItem
          title="Voice"
          description="The speaker's voice"
          type="select"
          value={speechOptions.voice}
          setValue={voice => setSpeechOptions({voice})}
          items={voices}
          rightButton={<PreviewButton onPress={() => introduceVoice(speechOptions.voice)} />}
        />
        <SettingsItem
          title="Rate"
          description="The rate of the speaker's speech"
          type="slider"
          value={speechOptions.rate}
          setValue={rate => setSpeechOptions({rate})}
          min={0.5}
          max={1.5}
          step={0.1}
          rightButton={<PreviewButton onPress={() => introduceRate()} />}
        />
        {speechOptions.engine === "device" && <SettingsItem
          title="Pitch"
          description="Pitch of the speaker's voice"
          type="slider"
          value={speechOptions.pitch}
          setValue={pitch => setSpeechOptions({pitch})}
          min={0.5}
          max={1.5}
          step={0.1}
          rightButton={<PreviewButton onPress={() => introducePitch()} />}
        />}
        <SettingsItem
          title="Speak on press"
          description="Speak every time a button is pressed"
          type="toggle"
          value={playOnPress}
          setValue={togglePlayOnPress}
          labels={['Off', 'On']}
        />
        <SettingsHeader title="Interface" icon={Monitor} />
        <SettingsItem
          title="Button view"
          description="Choose what to display on the buttons"
          type="select"
          value={buttonView}
          setValue={(val) => setButtonView(val as ButtonViewOption)}
          items={buttonViewOptions.map(value => {return { label: buttonViewLabels[value], value }})}
        />
        {buttonView === "both" && <SettingsItem
          title="Text position"
          description="Choose whether the text appears above or below the symbol"
          type="toggle"
          value={labelLocation === "top"}
          setValue={val => setLabelLocation(val ? "top" : "bottom")}
          labels={['Below', 'Above']}
        />}
        <SettingsItem
          title="Message window position"
          description="Choose where the message window appears"
          type="toggle"
          value={messageWindowLocation === "top"}
          setValue={val => setMessageWindowLocation(val ? "top" : "bottom")}
          labels={['Bottom', 'Top']}
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
        <SettingsItem
          title="Show backspace"
          description="Display a button to remove last word"
          type="toggle"
          value={showBackspace}
          setValue={toggleShowBackspace}
        />
        <SettingsItem
          title="Show copy button"
          description="Display a button to copy to clipboard"
          type="toggle"
          value={showShareButton}
          setValue={toggleShowShareButton}
        />
        <SettingsHeader title="About" icon={Info} />
        <View style={{ padding: PADDING.lg, display: 'flex', gap: GAP.lg }}>
          <View style={{ display: 'flex', flexDirection: 'row', gap: GAP.lg }}>
            <Image source={assets?.at(0)} style={{ width: ICON_SIZE.xxl, height: ICON_SIZE.xxl }} />
            <View>
              <Text style={{ fontSize: FONT_SIZE.xxl, marginBottom: PADDING.sm }}>FreeAAC</Text>
              {appVersion && <Text>Version {appVersion}</Text>}
            </View>
          </View>
          <LinkButton
            href="https://github.com/sonicbaume/FreeAAC"
            title="Visit project page"
            icon={GithubIcon}
          />
          <LinkButton
            href="https://github.com/sonicbaume/FreeAAC/issues/new?type=bug"
            title="Report an issue"
            icon={Bug}
          />
          <LinkButton
            href="https://github.com/sonicbaume/FreeAAC/issues/new?type=feature"
            title="Suggest a feature"
            icon={Lightbulb}
          />
          <LinkButton
            href="/privacy"
            title="Privacy policy"
            icon={Shield}
          />
          <Link
            href="https://sonic.bau.me"
            style={{ textAlign: 'center', marginTop: PADDING.xl, color: theme.onSurfaceVariant }}
          >
            ©️ Sonic Baume LTD 2026
          </Link>
          <Text style={{ textAlign: 'center', color: theme.onSurfaceVariant }}>
            Released under AGPL v3
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}
