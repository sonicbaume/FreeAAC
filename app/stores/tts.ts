import { create } from "zustand";

interface TtsState {
  model: any;
  setModel: (model: any) => void
}
export const useTtsStore = create<TtsState>((set) => ({
  model: undefined,
  setModel: (model: any) => set({ model })
}))

export const useTtsModel = () => useTtsStore(s => s.model)
export const useSetTtsModel = () => useTtsStore(s => s.setModel)