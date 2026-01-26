import { SpeechOptions } from "expo-speech";
import { create } from "zustand";

interface TtsStatus {
  isReady: boolean;
  isGenerating: boolean;
  downloadProgress: number;
}

interface AudioState {
  speak: (text: string, options?: Partial<SpeechOptions>) => Promise<void>;
  ttsStatus: TtsStatus,
  actions: {
    setSpeak: (callback: (text: string, options?: Partial<SpeechOptions>) => Promise<void>) => void;
    setTtsStatus: (ttsStatus: TtsStatus) => void;
  }
}
export const useAudioStore = create<AudioState>((set) => ({
  speak: async (text: string) => {},
  ttsStatus: {
    isReady: false,
    isGenerating: false,
    downloadProgress: 0
  },
  actions: {
    setSpeak: (callback) => set({speak: callback}),
    setTtsStatus: (ttsStatus) => set({ttsStatus})
  }
}))

export const useSpeak = () => useAudioStore(s => s.speak)
export const useTtsStatus = () => useAudioStore(s => s.ttsStatus)
export const useAudioActions = () => useAudioStore(s => s.actions)