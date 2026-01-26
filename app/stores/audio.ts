import { create } from "zustand";

interface AudioState {
  onNext: (audioVec: Float32Array) => Promise<void>;
  onEnd: () => Promise<void>;
  actions: {
    setOnNext: (onNext: (audioVec: Float32Array) => Promise<void>) => void;
    setOnEnd: (onEnd: () => Promise<void>) => void;
  }
}
export const useAudioStore = create<AudioState>((set) => ({
  onNext: async (audioVec: Float32Array) => {},
  onEnd: async () => {},
  actions: {
    setOnNext: (callback) => set({onNext: callback}),
    setOnEnd: (callback) => set({onEnd: callback})
  }
}))

export const useOnNext = () => useAudioStore(s => s.onNext)
export const useOnEnd = () => useAudioStore(s => s.onEnd)
export const useAudioActions = () => useAudioStore(s => s.actions)