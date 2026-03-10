import { useEffect, useState } from "react"
import { Platform, useColorScheme as useRNColorScheme } from "react-native"

export function useColorScheme() {
  const nativeColorScheme = useRNColorScheme() ?? "light"
  const [webColorScheme, setWebColorScheme] = useState<"light" | "dark">(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ?
          "dark"
        : "light"
    }
    return "light"
  })

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      setWebColorScheme(e.matches ? "dark" : "light")
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return Platform.OS === "web" ? webColorScheme : nativeColorScheme
}
