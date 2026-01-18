import { create } from 'zustand';

interface PrefsState {
  playOnPress: boolean;
  togglePlayOnPress: () => void;
}

const usePrefsStore = create<PrefsState>((set) => ({
  playOnPress: true,
  togglePlayOnPress: () => set((state) => ({ playOnPress: !state.playOnPress })),
}))

export const usePlayOnPress = () => usePrefsStore(s => s.playOnPress)
export const useTogglePlayOnPress = () => usePrefsStore(s => s.togglePlayOnPress)