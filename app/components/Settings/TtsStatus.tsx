import { CheckCircleIcon } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTtsStatus } from "../../stores/audio";

const iconSize = 20

export default function TtsStatus() {
  const { isReady, isGenerating, downloadProgress } = useTtsStatus()
  let statusText = "Ready"
  let statusIcon = <CheckCircleIcon size={iconSize} color="green" />
  if (!isReady) {
    statusIcon = <ActivityIndicator size="small" />
    if (downloadProgress > 0 && downloadProgress < 1) {
      statusText = `Downloading: ${(downloadProgress * 100).toFixed(0)}%`
    } else {
      statusText = "Loading"
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Status</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.text}>{statusText}</Text>
        {statusIcon}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    justifyContent: 'space-between',
    gap: 20
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  text: {
    fontSize: 16
  }
})