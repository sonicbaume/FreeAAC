import { Alert } from "react-native";

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
  Alert.alert(message)
  return undefined
}