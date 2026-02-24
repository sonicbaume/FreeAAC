import { FONT_SIZE, GAP, ICON_SIZE, PADDING, useTheme } from "@/app/utils/theme";
import { CheckCircleIcon } from "lucide-react-native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTtsStatus } from "../../stores/audio";
import { Text } from "../Styled";

export default function TtsStatus() {
  const theme = useTheme()
  const { isReady, downloadProgress } = useTtsStatus()
  let statusText = "Ready"
  let statusIcon = <CheckCircleIcon size={ICON_SIZE.md} color={theme.onSurface} />
  if (!isReady) {
    statusIcon = <ActivityIndicator size="small" color={theme.onSurface}  />
    if (downloadProgress > 0 && downloadProgress < 1) {
      statusText = `Downloading: ${(downloadProgress * 100).toFixed(0)}%`
    } else {
      statusText = "Loading"
    }
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: FONT_SIZE.md }}>Status</Text>
      <View style={styles.statusContainer}>
        <Text style={{ fontSize: FONT_SIZE.md }}>{statusText}</Text>
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
    padding: PADDING.xl,
    justifyContent: 'space-between',
    gap: GAP.xl
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: GAP.md,
    alignItems: 'center'
  },
})