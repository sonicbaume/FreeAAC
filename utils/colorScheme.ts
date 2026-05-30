import { useEffect, useState } from "react"
import { Platform, useColorScheme as useRNColorScheme } from "react-native"

declare global {
  interface Window {
    __FREEAAC_INITIAL_SCHEME__?: "light" | "dark"
  }
}

export function useColorScheme() {
  const rnColorScheme = useRNColorScheme()
  const nativeColorScheme =
    rnColorScheme === "unspecified" ? "light" : rnColorScheme

  const [webColorScheme, setWebColorScheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const initial =
        window.__FREEAAC_INITIAL_SCHEME__ ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      setWebColorScheme(initial)
      document.documentElement.style.colorScheme = initial

      // Remove the blocker now that the correct theme is applied
      const blocker = document.getElementById("__freeaac_theme_blocker__")
      if (blocker) blocker.remove()
 
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e: MediaQueryListEvent) => {
        const next = e.matches ? "dark" : "light"
        setWebColorScheme(next)
        document.documentElement.style.colorScheme = next
      }
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return Platform.OS === "web" ? webColorScheme : nativeColorScheme
}
