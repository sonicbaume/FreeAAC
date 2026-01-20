import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface Board {
  id: string;
  uri: string;
  name: string;
}

interface PagesetsState {
  boards: Board[];
  currentBoardId: string | undefined;
  currentPageId: string | undefined;
  messageButtonsIds: string[];
  actions: {
    setCurrentBoardId: (boardId: string | undefined) => void;
    setCurrentPageId: (pageId: string | undefined) => void;
    addBoard: (boards: Board) => void;
    removeBoard: (id: string) => void;
    addMessageButtonId: (buttonId: string) => void;
    removeLastMessageButtonId: () => void;
    clearMessageButtonIds: () => void;
  }
}

const useStore = create<PagesetsState>()(persist(
  (set, get) => ({
    boards: [],
    currentBoardId: undefined,
    currentPageId: undefined,
    messageButtonsIds: [],
    actions: {
      setCurrentBoardId: (boardId) => set({
        currentBoardId: boardId
      }),
      setCurrentPageId: (pageId) => set({
        currentPageId: pageId
      }),
      addBoard: (board: Board) => set({
        boards: [...get().boards, board]
      }),
      removeBoard: (id: string) => set({
        boards: get().boards.filter(board => board.id !== id)
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

export const useBoards = () => useStore(s => s.boards)
export const useCurrentBoardId = () => useStore(s => s.currentBoardId)
export const useCurrentPageId = () => useStore(s => s.currentPageId)
export const useMessageButtonsIds = () => useStore(s => s.messageButtonsIds)
export const usePagesetActions = () => useStore(s => s.actions)