import { TrueSheetProvider } from "@lodev09/react-native-true-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AudioController from "./components/AudioController";
import SettingsButton from "./components/Settings/Button";
import { appDescription, appName } from "./utils/consts";
import { ICON_SIZE, ThemeContext, themes } from "./utils/theme";

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [assets, error] = useAssets([require('../assets/images/icon-64x64.png')])
  const queryClient = new QueryClient()
  const themeId = useColorScheme() ?? 'light'
  const theme = themes[themeId]

  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.surfaceContainer,
    },
    headerLeft: {
      backgroundColor: theme.surfaceContainer,
      ...Platform.select({
        web: {
          marginLeft: 16,
          marginRight: 12
        },
        android: {
          marginRight: 12
        }
      })
    },
    headerRight: {
      ...Platform.select({
      web: {
        marginRight: 16
      }
    })}
  })

  return <Head.Provider>
    {Platform.OS === "web" &&
    <Head>
      <title>{appName}</title>
      <meta name="description" content={appDescription} />
    </Head>
    }
    <QueryClientProvider client={queryClient}>
      <ThemeContext value={theme}>
        <TrueSheetProvider>
          <GestureHandlerRootView>
            <Stack screenOptions={{
              headerBackButtonDisplayMode: "minimal",
            }}>
              <Stack.Screen name="index" options={{
                headerStyle: styles.header,
                headerTintColor: theme.onSurface,
                headerTitle: 'FreeAAC',
                headerLeft: () => (
                  <View style={styles.headerLeft}>
                    <Image
                      source={assets?.at(0)}
                      style={{ width: ICON_SIZE.xl, height: ICON_SIZE.xl }}
                    />
                  </View>
                ),
                headerRight: () => <View style={styles.headerRight}>
                  <SettingsButton />
                </View>,
              }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerTitle: 'Settings',
                  headerStyle: styles.header,
                  headerTintColor: theme.onSurface
                }}
              />
              <Stack.Screen
                name="templates"
                options={{
                  headerTitle: 'Templates',
                  headerStyle: styles.header,
                  headerTintColor: theme.onSurface
                }}
              />
              <Stack.Screen
                name="privacy"
                options={{
                  headerTitle: 'Privacy policy',
                  headerStyle: styles.header,
                  headerTintColor: theme.onSurface
                }}
              />
              <Stack.Screen
                name="create"
                options={{
                  headerTitle: 'Create board',
                  headerStyle: styles.header,
                  headerTintColor: theme.onSurface
                }}
              />
            </Stack>
          </GestureHandlerRootView>
        </TrueSheetProvider>
      </ThemeContext>
    </QueryClientProvider>
    <AudioController />
  </Head.Provider>
}
