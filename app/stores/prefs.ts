import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PrefsState {
  playOnPress: boolean;
  actions: {
    togglePlayOnPress: () => void;
  }
}

export const usePrefsStore = create<PrefsState>()(persist(
  (set, get) => ({
    playOnPress: true,
    actions: {
      togglePlayOnPress: () => set({ playOnPress: !(get().playOnPress) }),
    }
  }),
  {
    name: 'prefs',
    storage: createJSONStorage(() => zustandStorage)
  },
))

export const usePlayOnPress = () => usePrefsStore(s => s.playOnPress)
export const usePrefsActions = () => usePrefsStore(s => s.actions)