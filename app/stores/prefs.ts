import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PrefsState {
  playOnPress: boolean;
  messageWindowLocation: 'top' | 'bottom';
  actions: {
    togglePlayOnPress: () => void;
    setMessageWindowLocation: (location: 'top' | 'bottom') => void;
  }
}

export const usePrefsStore = create<PrefsState>()(persist(
  (set, get) => ({
    playOnPress: true,
    messageWindowLocation: 'top',
    actions: {
      togglePlayOnPress: () => set({ playOnPress: !(get().playOnPress) }),
      setMessageWindowLocation: (location: 'top' | 'bottom') => set({ messageWindowLocation: location }),
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
export const usePrefsActions = () => usePrefsStore(s => s.actions)
export const useMessageWindowLocation = () => usePrefsStore(s => s.messageWindowLocation)