import { Stack } from "expo-router";
import SettingsButton from "./components/SettingsButton";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerRight: () => <SettingsButton />
    }}>
      <Stack.Screen name="index" options={{ headerTitle: 'FreeAAC' }} />
      <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
      <Stack.Screen name="templates" options={{ headerTitle: 'Templates' }} />
    </Stack>
  )
}
