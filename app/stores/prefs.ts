import { SpeechOptions as ExpoSpeechOptions } from "expo-speech"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { defaultTileSpacing } from "../utils/consts"
import { zustandStorage } from "./middleware"

export const buttonViewOptions = ["both", "symbol", "text"] as const
export type ButtonViewOption = (typeof buttonViewOptions)[number]

export const speechEngines = ["device", "kokoro"]
export type SpeechEngine = (typeof speechEngines)[number]

export interface SpeechOptions extends ExpoSpeechOptions {
  pitch: number
  rate: number
  voice?: string
  engine: SpeechEngine
}

interface PrefsState {
  playOnPress: boolean
  labelLocation: "top" | "bottom"
  messageWindowLocation: "top" | "bottom"
  buttonView: ButtonViewOption
  speechOptions: SpeechOptions
  clearMessageOnPlay: boolean
  goHomeOnPress: boolean
  showShareButton: boolean
  showBackspace: boolean
  tileSpacing: number
  debounceTime: number | undefined
  actions: {
    togglePlayOnPress: () => void
    setMessageWindowLocation: (location: "top" | "bottom") => void
    setLabelLocation: (location: "top" | "bottom") => void
    setButtonView: (view: ButtonViewOption) => void
    setSpeechOptions: (options: Partial<SpeechOptions>) => void
    toggleClearMessageOnPlay: () => void
    toggleGoHomeOnPress: () => void
    toggleShowShareButton: () => void
    toggleShowBackspace: () => void
    setTileSpacing: (tileSpacing: number) => void
    setDebounceTime: (value: number | undefined) => void
  }
}

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      playOnPress: true,
      labelLocation: "bottom",
      messageWindowLocation: "top",
      buttonView: "both",
      speechOptions: {
        pitch: 1,
        rate: 1,
        voice: undefined,
        engine: "device",
      },
      clearMessageOnPlay: false,
      goHomeOnPress: false,
      showShareButton: false,
      showBackspace: true,
      tileSpacing: defaultTileSpacing,
      debounceTime: undefined,
      actions: {
        togglePlayOnPress: () => set({ playOnPress: !get().playOnPress }),
        setMessageWindowLocation: (location: "top" | "bottom") =>
          set({ messageWindowLocation: location }),
        setLabelLocation: (location: "top" | "bottom") =>
          set({ labelLocation: location }),
        setButtonView: (view: ButtonViewOption) => set({ buttonView: view }),
        setSpeechOptions: (options: Partial<SpeechOptions>) =>
          set({ speechOptions: { ...get().speechOptions, ...options } }),
        toggleClearMessageOnPlay: () =>
          set({ clearMessageOnPlay: !get().clearMessageOnPlay }),
        toggleGoHomeOnPress: () => set({ goHomeOnPress: !get().goHomeOnPress }),
        toggleShowShareButton: () =>
          set({ showShareButton: !get().showShareButton }),
        toggleShowBackspace: () => set({ showBackspace: !get().showBackspace }),
        setTileSpacing: (tileSpacing: number) => set({ tileSpacing }),
        setDebounceTime: (debounceTime) => set({ debounceTime }),
      },
    }),
    {
      name: "prefs",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["actions"].includes(key)),
        ),
    },
  ),
)

export const usePlayOnPress = () => usePrefsStore((s) => s.playOnPress)
export const useMessageWindowLocation = () =>
  usePrefsStore((s) => s.messageWindowLocation)
export const useLabelLocation = () => usePrefsStore((s) => s.labelLocation)
export const useButtonView = () => usePrefsStore((s) => s.buttonView)
export const useSpeechOptions = () => usePrefsStore((s) => s.speechOptions)
export const useClearMessageOnPlay = () =>
  usePrefsStore((s) => s.clearMessageOnPlay)
export const useGoHomeOnPress = () => usePrefsStore((s) => s.goHomeOnPress)
export const useShowShareButton = () => usePrefsStore((s) => s.showShareButton)
export const useShowBackspace = () => usePrefsStore((s) => s.showBackspace)
export const useTileSpacing = () => usePrefsStore((s) => s.tileSpacing)
export const useDebounceTime = () => usePrefsStore((s) => s.debounceTime)

export const usePrefsActions = () => usePrefsStore((s) => s.actions)
