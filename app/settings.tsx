import { Monitor, Speech } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import SettingsHeader from "./components/SettingsHeader";
import SettingsItem from "./components/SettingsItem";
import { useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions, useSpeechOptions } from "./stores/prefs";

export default function Settings() {
  const playOnPress = usePlayOnPress()
  const messageWindowLocation = useMessageWindowLocation()
  const labelLocation = useLabelLocation()
  const speechOptions = useSpeechOptions()
  const { togglePlayOnPress, setMessageWindowLocation, setLabelLocation, setSpeechOptions } = usePrefsActions()

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