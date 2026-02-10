import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AudioController from "./components/AudioController";
import SettingsButton from "./components/Settings/Button";
import { appDescription, appName } from "./utils/consts";

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [assets, error] = useAssets([require('../assets/images/icon-64x64.png')])
  return <Head.Provider>
    {Platform.OS === "web" &&
    <Head>
      <title>{appName}</title>
      <meta name="description" content={appDescription} />
    </Head>
    }
    <TrueSheetProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{
          headerBackButtonDisplayMode: "minimal",
        }}>
          <Stack.Screen name="index" options={{
            headerTitle: 'FreeAAC',
            headerLeft: () => (
              <View style={styles.headerLeft}>
                <Image source={assets?.at(0)} style={{ width: 32, height: 32 }} />
              </View>
            ),
            headerRight: () => <View style={styles.headerRight}>
              <SettingsButton style={{ padding: 6 }} />
            </View>,
          }}
          />
          <Stack.Screen name="settings" options={{ headerTitle: 'Settings' }} />
          <Stack.Screen name="templates" options={{ headerTitle: 'Templates' }} />
          <Stack.Screen name="privacy" options={{ headerTitle: 'Privacy policy' }} />
        </Stack>
      </GestureHandlerRootView>
    </TrueSheetProvider>
    <AudioController />
  </Head.Provider>
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