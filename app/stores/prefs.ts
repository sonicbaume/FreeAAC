import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PrefsState {
  playOnPress: boolean;
  togglePlayOnPress: () => void;
}

export const usePrefsStore = create<PrefsState>()(persist(
  (set, get) => ({
    playOnPress: true,
    togglePlayOnPress: () => set({ playOnPress: !(get().playOnPress) }),
  }),
  {
    name: 'prefs',
    storage: createJSONStorage(() => zustandStorage)
  },
))

export const usePlayOnPress = () => usePrefsStore(s => s.playOnPress)
export const useTogglePlayOnPress = () => usePrefsStore(s => s.togglePlayOnPress)