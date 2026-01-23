import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import SettingsButton from "./components/SettingsButton";

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [assets, error] = useAssets([require('../assets/images/icon-64x64.png')]);
  return (
    <Stack screenOptions={{
      headerBackButtonDisplayMode: "minimal",
      headerRight: () => <SettingsButton style={{ padding: 6, ...styles.settingsButton}} />,
    }}>
      <Stack.Screen name="index" options={{
        headerTitle: 'FreeAAC',
        headerLeft: () => <Image source={assets?.at(0)} style={{ width: 32, height: 32, ...styles.icon }} />,
      }}
      />
      <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
      <Stack.Screen name="templates" options={{ headerTitle: 'Templates' }} />
    </Stack>
  )
}

const styles = StyleSheet.create(
  Platform.OS === "web" ? {
    icon: {
      marginLeft: 20,
      marginRight: 8
    },
    settingsButton: {
      marginRight: 12
    }
  } : {}
)