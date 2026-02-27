import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './middleware';

interface Board {
  id: string;
  uri: string;
  name: string;
}

interface ButtonId {
  id: string;
  pageId: string;
}

interface PagesetsState {
  boards: Board[];
  currentBoardId: string | undefined;
  currentPageId: string | undefined;
  messageButtonsIds: ButtonId[];
  editMode: boolean;
  editButtonId: string | undefined;
  symbolSearchText: string;
  actions: {
    setCurrentBoardId: (boardId: string | undefined) => void;
    setCurrentPageId: (pageId: string | undefined) => void;
    addBoard: (boards: Board) => void;
    removeBoard: (id: string) => void;
    renameBoard: (id: string, name: string) => void;
    addMessageButtonId: (buttonId: ButtonId) => void;
    removeLastMessageButtonId: () => void;
    clearMessageButtonIds: () => void;
    toggleEditMode: () => void;
    setEditButtonId: (buttonId: string | undefined) => void;
    setSymbolSearchText: (text: string) => void;
  }
}

const useStore = create<PagesetsState>()(persist(
  (set, get) => ({
    boards: [],
    currentBoardId: undefined,
    currentPageId: undefined,
    messageButtonsIds: [],
    editMode: false,
    editButtonId: undefined,
    symbolSearchText: '',
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
      renameBoard: (id: string, name: string) => {
        const boards = [...get().boards]
        const board = boards.find(b => b.id === id)
        if (board) board.name = name
        set({ boards })
      },
      addMessageButtonId: (buttonId: ButtonId) => set({
        messageButtonsIds: [...get().messageButtonsIds, buttonId]
      }),
      removeLastMessageButtonId: () => set({
        messageButtonsIds: get().messageButtonsIds.slice(0, -1)
      }),
      clearMessageButtonIds: () => set({
        messageButtonsIds: []
      }),
      toggleEditMode: () => set({
        editMode: !get().editMode
      }),
      setEditButtonId: (buttonId: string | undefined) => set({
        editButtonId: buttonId
      }),
      setSymbolSearchText: (text: string) => set({
        symbolSearchText: text
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
export const useEditMode = () => useStore(s => s.editMode)
export const useEditButtonId = () => useStore(s => s.editButtonId)
export const useSymbolSearchText = () => useStore(s => s.symbolSearchText)
export const usePagesetActions = () => useStore(s => s.actions)