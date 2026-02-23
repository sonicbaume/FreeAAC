import { FONT_SIZE, GAP, ICON_SIZE, PADDING } from "@/app/utils/theme";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsHeader({
  title,
  icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  const Icon = icon
  return (
    <View style={styles.container}>
      <Icon size={ICON_SIZE.lg} />
      <Text style={{ fontSize: FONT_SIZE.md }}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.lg,
    marginTop: PADDING.xl,
    marginBottom: PADDING.lg,
  }
})