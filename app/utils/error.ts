import { Alert } from "react-native";

export const handleError = (
  message: string, 
  error: Error | undefined = undefined
) => {
  if (error) console.error(error)
  Alert.alert(message)
}