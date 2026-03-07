import * as Application from "expo-application"
import { useAssets } from "expo-asset"
import { Image } from "expo-image"
import { useLocales } from "expo-localization"
import { Link } from "expo-router"
import { getAvailableVoicesAsync } from "expo-speech"
import {
  Bug,
  Hand,
  Info,
  Lightbulb,
  List,
  LucideIcon,
  Monitor,
  Shield,
  Speech,
} from "lucide-react-native"
import { useEffect, useState } from "react"
import { Platform, ScrollView, StyleSheet, View } from "react-native"
import DialogConfirm from "./components/DialogConfirm"
import GithubIcon from "./components/Icons/Github"
import SettingsHeader from "./components/Settings/Header"
import SettingsItem from "./components/Settings/Item"
import LinkButton from "./components/Settings/LinkButton"
import PreviewButton from "./components/Settings/PreviewButton"
import TtsStatus from "./components/Settings/TtsStatus"
import { Text } from "./components/Styled"
import { useSpeak } from "./stores/audio"
import { useHistory, usePagesetActions, useShouldLog } from "./stores/boards"
import {
  ButtonViewOption,
  buttonViewOptions,
  SpeechEngine,
  speechEngines,
  useBackButton,
  useButtonView,
  useClearMessageOnPlay,
  useDebounceTime,
  useGoHomeOnPress,
  useLabelLocation,
  useMessageWindowLocation,
  usePlayOnPress,
  usePrefsActions,
  useShowBackspace,
  useShowShareButton,
  useSpeechOptions,
  useTileSpacing,
} from "./stores/prefs"
import {
  BackButton,
  backButtonValues,
  debounceValues,
  korokoVoices,
  speechPitchValues,
  speechRateValues,
  tileSpacingValues,
} from "./utils/consts"
import { handleError } from "./utils/error"
import { exportLogs } from "./utils/file"
import {
  FONT_SIZE,
  GAP,
  ICON_SIZE,
  MAX_WIDTH,
  PADDING,
  useTheme,
} from "./utils/theme"

const tagToCode = (langTag: string) => langTag.split(/[-_]+/)[0]
const harmoniseTag = (langTag: string) => langTag.replace("_", "-")

export const getVoiceOptions = async (
  engine: SpeechEngine,
  deviceLangCodes: string[],
) => {
  const allVoices =
    engine === "device" ? await getAvailableVoicesAsync()
    : engine === "kokoro" ? korokoVoices
    : []
  const allVoiceLangCodes = [
    ...new Set(allVoices.map((l) => tagToCode(l.language))),
  ]
  const matchingLangCodes = allVoiceLangCodes.filter((l) =>
    deviceLangCodes.includes(harmoniseTag(l)),
  )
  let localVoices = allVoices.filter((v) =>
    matchingLangCodes.includes(tagToCode(v.language)),
  )
  if (localVoices.length < 2) localVoices = allVoices
  return localVoices.map((v) => {
    return { value: v.identifier, label: v.name, langTag: v.language }
  })
}

const buttonViewLabels: Record<ButtonViewOption, string> = {
  both: "Symbol and text",
  symbol: "Symbol only",
  text: "Text only",
}
const speechEngineLabels: Record<SpeechEngine, string> = {
  device: "🤖 System TTS",
  kokoro:
    Platform.OS === "web" ? "✨ Neural TTS (mobile only)" : "✨ Neural TTS",
}

export default function Settings() {
  const theme = useTheme()
  const [assets] = useAssets([require("../assets/images/icon-64x64.png")])
  const [showDeleteLogsDialog, setShowDeleteLogsDialog] = useState(false)
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
  const tileSpacing = useTileSpacing()
  const debounceTime = useDebounceTime()
  const backButton = useBackButton()
  const locales = useLocales()
  const shouldLog = useShouldLog()
  const logHistory = useHistory()
  const {
    togglePlayOnPress,
    setMessageWindowLocation,
    setLabelLocation,
    setButtonView,
    setSpeechOptions,
    toggleClearMessageOnPlay,
    toggleGoHomeOnPress,
    toggleShowShareButton,
    toggleShowBackspace,
    setTileSpacing,
    setDebounceTime,
    setBackButton,
  } = usePrefsActions()
  const { toggleShouldLog, deleteLogs } = usePagesetActions()
  const [voices, setVoices] = useState<
    { value: string; label: string; langTag: string }[]
  >([])
  const speak = useSpeak()

  const styles = StyleSheet.create({
    container: {
      width: MAX_WIDTH,
      maxWidth: "100%",
      padding: PADDING.xl,
      marginHorizontal: "auto",
      backgroundColor: theme.surface,
    },
  })

  const introduceVoice = (voice: string | undefined) => {
    const voiceObject = voices.find((v) => v.value === voice)
    const name = voiceObject?.label.replace(/\(.*\)/, "")
    if (name)
      speak(`Hi there! My name is ${name}`, { voice: voiceObject?.value })
  }
  const introduceRate = () => speak("This is how fast I talk")
  const introducePitch = () => speak("This is the pitch of my voice")

  useEffect(() => {
    ;(async () => {
      const deviceLangCodes = [
        ...new Set(locales.map((l) => l.languageCode)),
      ].filter((l) => l !== null)
      const voiceOptions = await getVoiceOptions(
        speechOptions.engine,
        deviceLangCodes,
      )
      setVoices(voiceOptions)

      if (
        speechOptions.voice === undefined ||
        voiceOptions.find((v) => v.value === speechOptions.voice) === undefined
      ) {
        setSpeechOptions({ voice: voiceOptions[0].value })
      }
    })()
  }, [locales, setSpeechOptions, speechOptions.engine, speechOptions.voice])

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View style={{ ...styles.container, paddingBottom: 200 }}>
          <SettingsHeader title="Speech" icon={Speech} />
          <SettingsItem
            title="Engine"
            description="Text-to-speech engine"
            type="select"
            value={speechOptions.engine}
            setValue={(engine) => {
              if (engine !== "device" && Platform.OS === "web") {
                return handleError("Unavailable on this platform")
              }
              setSpeechOptions({ engine })
            }}
            items={speechEngines.map((value) => {
              return { label: speechEngineLabels[value], value }
            })}
          />
          {speechOptions.engine === "kokoro" && <TtsStatus />}
          <SettingsItem
            title="Voice"
            description="The speaker's voice"
            type="select"
            value={speechOptions.voice}
            setValue={(voice) => setSpeechOptions({ voice })}
            items={voices}
            rightButton={
              <PreviewButton
                onPress={() => introduceVoice(speechOptions.voice)}
              />
            }
          />
          <SettingsItem
            title="Rate"
            description="The rate of the speaker's speech"
            type="select"
            items={speechRateValues}
            value={speechOptions.rate.toFixed(1)}
            setValue={(value) =>
              value && setSpeechOptions({ rate: parseFloat(value) })
            }
            rightButton={<PreviewButton onPress={() => introduceRate()} />}
          />
          {speechOptions.engine === "device" && (
            <SettingsItem
              title="Pitch"
              description="Pitch of the speaker's voice"
              type="select"
              items={speechPitchValues}
              value={speechOptions.pitch.toFixed(1)}
              setValue={(value) =>
                value && setSpeechOptions({ pitch: parseFloat(value) })
              }
              rightButton={<PreviewButton onPress={() => introducePitch()} />}
            />
          )}
          <SettingsItem
            title="Speak on press"
            description="Speak every time a button is pressed"
            type="toggle"
            value={playOnPress}
            setValue={togglePlayOnPress}
            labels={["Off", "On"]}
          />
          <SettingsHeader title="Display" icon={Monitor} />
          <SettingsItem
            title="Button view"
            description="Choose what to display on the buttons"
            type="select"
            value={buttonView}
            setValue={(val) => setButtonView(val as ButtonViewOption)}
            items={buttonViewOptions.map((value) => {
              return { label: buttonViewLabels[value], value }
            })}
          />
          {buttonView === "both" && (
            <SettingsItem
              title="Text position"
              description="Choose whether the text appears above or below the symbol"
              type="toggle"
              value={labelLocation === "top"}
              setValue={(val) => setLabelLocation(val ? "top" : "bottom")}
              labels={["Below", "Above"]}
            />
          )}
          <SettingsItem
            title="Message window position"
            description="Choose where the message window appears"
            type="toggle"
            value={messageWindowLocation === "top"}
            setValue={(val) => setMessageWindowLocation(val ? "top" : "bottom")}
            labels={["Bottom", "Top"]}
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
          <SettingsItem
            title="Grid gap"
            description="Space between tiles in the grid"
            type="select"
            items={tileSpacingValues}
            value={tileSpacing.toFixed(0)}
            setValue={(value) => value && setTileSpacing(parseInt(value))}
          />
          <SettingsItem
            title="Backwards navigation"
            description="Which buttons to show"
            type="select"
            items={backButtonValues}
            value={backButton}
            setValue={(value) => setBackButton(value as BackButton)}
          />
          <SettingsHeader title="Interaction" icon={Hand} />
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
            title="Prevent double-taps"
            description="Ignore subsequent touches for a time"
            type="select"
            items={debounceValues}
            value={debounceTime?.toFixed(2)}
            setValue={(value) =>
              setDebounceTime(value ? parseFloat(value) : undefined)
            }
          />
          <SettingsHeader title="Logging" icon={List} />
          <SettingsItem
            title="Log events"
            description="Record a history of interactions"
            type="toggle"
            value={shouldLog}
            setValue={toggleShouldLog}
          />
          <SettingsItem
            title="Export logs"
            description="Download logs as an OBL file"
            type="button"
            label="Export logs"
            onPress={() => exportLogs(logHistory)}
          />
          <SettingsItem
            title="Delete logs"
            description="Remove entire logging history"
            type="button"
            label="Delete logs"
            onPress={() => setShowDeleteLogsDialog(true)}
          />
          <SettingsHeader title="About" icon={Info} />
          <View style={{ padding: PADDING.lg, display: "flex", gap: GAP.lg }}>
            <View
              style={{ display: "flex", flexDirection: "row", gap: GAP.lg }}
            >
              <Image
                source={assets?.at(0)}
                style={{ width: ICON_SIZE.xxl, height: ICON_SIZE.xxl }}
              />
              <View>
                <Text
                  style={{ fontSize: FONT_SIZE.xxl, marginBottom: PADDING.sm }}
                >
                  FreeAAC
                </Text>
                {appVersion && <Text>Version {appVersion}</Text>}
              </View>
            </View>
            <LinkButton
              href="https://github.com/sonicbaume/FreeAAC"
              title="Visit project page"
              icon={GithubIcon as LucideIcon}
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
            <LinkButton href="/privacy" title="Privacy policy" icon={Shield} />
            <Link
              href="https://sonic.bau.me"
              style={{
                textAlign: "center",
                marginTop: PADDING.xl,
                color: theme.onSurfaceVariant,
              }}
            >
              © Sonic Baume LTD 2026
            </Link>
            <Text
              style={{ textAlign: "center", color: theme.onSurfaceVariant }}
            >
              Released under AGPL v3
            </Text>
          </View>
        </View>
      </ScrollView>
      <DialogConfirm
        message="Are you sure you want to delete your entire log history?"
        visible={showDeleteLogsDialog}
        onCancel={() => setShowDeleteLogsDialog(false)}
        onConfirm={() => {
          deleteLogs()
          setShowDeleteLogsDialog(false)
        }}
      />
    </>
  )
}
