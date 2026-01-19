import { AACPage } from '@willwade/aac-processors/browser';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface PageState {
  pages: AACPage[];
  currentPage: AACPage | undefined;
  actions: {
    addPage: (page: AACPage) => void;
    removePage: (page: AACPage) => void;
    setCurrentPage: (page: AACPage) => void;
  }
}

const useStore = create<PageState>()(persist(
  (set, get) => ({
    pages: [],
    currentPage: undefined,
    actions: {
      addPage: (page) => set({ pages: [...get().pages, page] }),
      removePage: (page) => set({ pages: get().pages.filter(p => p.id !== page.id) }),
      setCurrentPage: (page) => set({ currentPage: page })
    }
  }),
  {
    name: 'page',
    storage: createJSONStorage(() => zustandStorage)
  },
))

export const usePages = () => useStore(s => s.pages)
export const useCurrentPage = () => useStore(s => s.currentPage)
export const usePageActions = () => useStore(s => s.actions)