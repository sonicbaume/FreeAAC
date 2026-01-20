import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: 'FreeAAC' }} />
      <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
    </Stack>
  )
}
