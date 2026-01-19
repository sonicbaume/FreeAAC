import { Alert, Platform } from "react-native";

export const handleError = (e: unknown) => {
  let message = ""
  if (e instanceof Error) {
    message = e.message
  } else if (typeof(e) === "string") {
    message = e
  } else {
    message = String(e)
  }
  console.error(e)
  if (Platform.OS === "android" || Platform.OS === "ios")
    Alert.alert(message)
  if (Platform.OS === "web") alert(message)
  return undefined
}