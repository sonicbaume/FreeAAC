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
      <Icon size={20} />
      <Text style={{ fontSize: 16 }}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20 }
})