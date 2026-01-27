import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import AudioController from "./components/AudioController";
import SettingsButton from "./components/Settings/Button";

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [assets, error] = useAssets([require('../assets/images/icon-64x64.png')])
  return <>
    <Stack screenOptions={{
      headerBackButtonDisplayMode: "minimal",
      headerRight: () => <View style={styles.headerRight}>
        <SettingsButton style={{ padding: 6 }} />
      </View>,
    }}>
      <Stack.Screen name="index" options={{
        headerTitle: 'FreeAAC',
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <Image source={assets?.at(0)} style={{ width: 32, height: 32 }} />
          </View>
        ),
      }}
      />
      <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
      <Stack.Screen name="templates" options={{ headerTitle: 'Templates' }} />
    </Stack>
    <AudioController />
  </>
}

const styles = StyleSheet.create(
  Platform.OS === "web" ? {
    headerLeft: {
      marginLeft: 16,
      marginRight: 12
    },
    headerRight: {
      marginRight: 16
    }
  } :
  Platform.OS === "android" ? {
    headerLeft: {
      marginRight: 12
    },
  } :
  Platform.OS === "ios" ? {

  } : {}
)