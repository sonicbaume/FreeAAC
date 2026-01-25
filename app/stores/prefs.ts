import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

export const buttonViewOptions = [ 'both', 'symbol', 'text' ] as const
export type ButtonViewOption = typeof buttonViewOptions[number]

export interface SpeechOptions {
  pitch: number;
  rate: number;
  voice: string | undefined;
}

interface PrefsState {
  playOnPress: boolean;
  labelLocation: 'top' | 'bottom';
  messageWindowLocation: 'top' | 'bottom';
  buttonView: ButtonViewOption;
  speechOptions: SpeechOptions;
  clearMessageOnPlay: boolean;
  goHomeOnPress: boolean;
  actions: {
    togglePlayOnPress: () => void;
    setMessageWindowLocation: (location: 'top' | 'bottom') => void;
    setLabelLocation: (location: 'top' | 'bottom') => void;
    setButtonView: (view: ButtonViewOption) => void;
    setSpeechOptions: (options: Partial<SpeechOptions>) => void;
    toggleClearMessageOnPlay: () => void;
    toggleGoHomeOnPress: () => void;
  }
}

export const usePrefsStore = create<PrefsState>()(persist(
  (set, get) => ({
    playOnPress: true,
    labelLocation: 'bottom',
    messageWindowLocation: 'bottom',
    buttonView: 'both',
    speechOptions: {
      pitch: 1,
      rate: 1,
      voice: undefined
    },
    clearMessageOnPlay: false,
    goHomeOnPress: false,
    actions: {
      togglePlayOnPress: () => set({ playOnPress: !(get().playOnPress) }),
      setMessageWindowLocation: (location: 'top' | 'bottom') => set({ messageWindowLocation: location }),
      setLabelLocation: (location: 'top' | 'bottom') => set({ labelLocation: location }),
      setButtonView: (view: ButtonViewOption) => set({ buttonView: view }),
      setSpeechOptions: (options: Partial<SpeechOptions>) => set({ speechOptions: { ...get().speechOptions, ...options } }),
      toggleClearMessageOnPlay: () => set({ clearMessageOnPlay: !(get().clearMessageOnPlay) }),
      toggleGoHomeOnPress: () => set({ goHomeOnPress: !(get().goHomeOnPress) })
    }
  }),
  {
    name: 'prefs',
    storage: createJSONStorage(() => zustandStorage),
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !['actions'].includes(key)),
      ),
  },
))

export const usePlayOnPress = () => usePrefsStore(s => s.playOnPress)
export const useMessageWindowLocation = () => usePrefsStore(s => s.messageWindowLocation)
export const useLabelLocation = () => usePrefsStore(s => s.labelLocation)
export const useButtonView = () => usePrefsStore(s => s.buttonView)
export const useSpeechOptions = () => usePrefsStore(s => s.speechOptions)
export const useClearMessageOnPlay = () => usePrefsStore(s => s.clearMessageOnPlay)
export const useGoHomeOnPress = () => usePrefsStore(s => s.goHomeOnPress)

export const usePrefsActions = () => usePrefsStore(s => s.actions)