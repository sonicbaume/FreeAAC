import { Monitor, Speech } from "lucide-react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import SettingsHeader from "./components/SettingsHeader";
import SettingsItem from "./components/SettingsItem";
import { useLabelLocation, useMessageWindowLocation, usePlayOnPress, usePrefsActions } from "./stores/prefs";

export default function Settings() {
  const playOnPress = usePlayOnPress()
  const messageWindowLocation = useMessageWindowLocation()
  const labelLocation = useLabelLocation()
  const { togglePlayOnPress, setMessageWindowLocation, setLabelLocation } = usePrefsActions()

  return (
    <ScrollView contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.container}>
        <SettingsHeader title="Speech" icon={Speech} />
        <SettingsItem
          title="Play Sound on Press"
          description="Play a sound effect when buttons are pressed"
          type="toggle"
          value={playOnPress}
          setValue={togglePlayOnPress}
          toggleLabels={['Off', 'On']}
        />
        <SettingsHeader title="Interface" icon={Monitor} />
        <SettingsItem
          title="Message Window Location"
          description="Choose where the message window appears"
          type="toggle"
          value={messageWindowLocation === "top"}
          setValue={val => setMessageWindowLocation(val ? "top" : "bottom")}
          toggleLabels={['Bottom', 'Top']}
        />
        <SettingsItem
          title="Label Location"
          description="Choose where labels appear in relation to icons"
          type="toggle"
          value={labelLocation === "top"}
          setValue={val => setLabelLocation(val ? "top" : "bottom")}
          toggleLabels={['Below', 'Above']}
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