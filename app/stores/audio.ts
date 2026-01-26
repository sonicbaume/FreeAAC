import { create } from "zustand";

interface AudioState {
  speak: (text: string) => Promise<void>;
  actions: {
    setSpeak: (callback: (text: string) => Promise<void>) => void;
  }
}
export const useAudioStore = create<AudioState>((set) => ({
  speak: async (text: string) => {},
  actions: {
    setSpeak: (callback) => set({speak: callback})
  }
}))

export const useSpeak = () => useAudioStore(s => s.speak)
export const useAudioActions = () => useAudioStore(s => s.actions)