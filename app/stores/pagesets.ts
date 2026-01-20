import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PagesetsState {
  treeFiles: string[];
  currentTreeFile: string | undefined;
  currentPageId: string | undefined;
  messageButtonsIds: string[];
  actions: {
    setCurrentTreeFile: (treeFile: string | undefined) => void;
    setCurrentPageId: (pageId: string | undefined) => void;
    addTreeFile: (treeFile: string) => void;
    removeTreeFile: (treeFile: string) => void;
    addMessageButtonId: (buttonId: string) => void;
    removeLastMessageButtonId: () => void;
    clearMessageButtonIds: () => void;
  }
}

const useStore = create<PagesetsState>()(persist(
  (set, get) => ({
    treeFiles: [],
    currentTreeFile: undefined,
    currentPageId: undefined,
    messageButtonsIds: [],
    actions: {
      setCurrentTreeFile: (treeFile) => set({
        currentTreeFile: treeFile
      }),
      setCurrentPageId: (pageId) => set({
        currentPageId: pageId
      }),
      addTreeFile: (treeFile: string) => set({
        treeFiles: [...get().treeFiles, treeFile]
      }),
      removeTreeFile: (treeFile: string) => set({
        treeFiles: get().treeFiles.filter(file => file !== treeFile)
      }),
      addMessageButtonId: (buttonId: string) => set({
        messageButtonsIds: [...get().messageButtonsIds, buttonId]
      }),
      removeLastMessageButtonId: () => set({
        messageButtonsIds: get().messageButtonsIds.slice(0, -1)
      }),
      clearMessageButtonIds: () => set({
        messageButtonsIds: []
      }),
    }
  }),
  {
    name: 'pagesets',
    storage: createJSONStorage(() => zustandStorage),
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state).filter(([key]) => !['actions'].includes(key)),
      ),
  },
))

export const useTreeFiles = () => useStore(s => s.treeFiles)
export const useCurrentTreeFile = () => useStore(s => s.currentTreeFile)
export const useCurrentPageId = () => useStore(s => s.currentPageId)
export const useMessageButtonsIds = () => useStore(s => s.messageButtonsIds)
export const usePagesetActions = () => useStore(s => s.actions)