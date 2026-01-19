import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PageState {
  treeFiles: string[];
  currentTreeFile: string | undefined;
  currentPageId: string | undefined;
  actions: {
    setCurrentTreeFile: (treeFile: string | undefined) => void;
    setCurrentPageId: (pageId: string | undefined) => void;
    addTreeFile: (treeFile: string) => void;
    removeTreeFile: (treeFile: string) => void;
  }
}

const useStore = create<PageState>()(persist(
  (set, get) => ({
    treeFiles: [],
    currentTreeFile: undefined,
    currentPageId: undefined,
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
      })
    }
  }),
  {
    name: 'page',
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
export const usePageActions = () => useStore(s => s.actions)