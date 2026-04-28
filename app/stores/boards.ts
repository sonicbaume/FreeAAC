import { HistoryEntry } from "@willwade/aac-processors/analytics"
import { nanoid } from "nanoid/non-secure"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { LogEvent, parseLogContent, parseLogEvent } from "../utils/logging"
import { BoardButton } from "../utils/types"
import { zustandStorage } from "./middleware"

const generateEntry = (content: string): HistoryEntry => {
  return {
    id: nanoid(),
    content,
    occurrences: [],
    source: "OBL",
  }
}

interface Board {
  id: string
  name: string
  rootPage?: string
  pages?: Record<
    string,
    {
      name: string
      path: string
    }
  >
}

interface PagesetsState {
  loaded: boolean
  boards: Board[]
  messageButtons: BoardButton[]
  editMode: boolean
  editButtonId: string | undefined
  symbolSearchText: string
  customMessages: Record<string, string>
  history: HistoryEntry[]
  shouldLog: boolean
  actions: {
    setLoaded: (loaded: boolean) => void
    addBoard: (boards: Board) => void
    removeBoard: (id: string) => void
    updateBoard: (id: string, changes: Partial<Board>) => void
    addMessageButton: (button: BoardButton) => void
    removeLastMessageButton: () => void
    clearMessageButtons: () => void
    toggleEditMode: () => void
    setEditButtonId: (buttonId: string | undefined) => void
    setSymbolSearchText: (text: string) => void
    addCustomMessage: (id: string, text: string) => void
    logEvent(event: LogEvent, pageId: string, boardId: string): void
    toggleShouldLog(): void
    deleteLogs(): void
  }
}

const useStore = create<PagesetsState>()(
  persist(
    (set, get) => ({
      loaded: false,
      boards: [],
      messageButtons: [],
      editMode: false,
      editButtonId: undefined,
      symbolSearchText: "",
      customMessages: {},
      history: [],
      shouldLog: false,
      actions: {
        setLoaded: (loaded) =>
          set({
            loaded,
          }),
        addBoard: (board: Board) =>
          set({
            boards: [...get().boards, board],
          }),
        removeBoard: (id: string) =>
          set({
            boards: get().boards.filter((board) => board.id !== id),
          }),
        updateBoard: (id: string, changes: Partial<Board>) => {
          const boards = [...get().boards]
          const boardIndex = boards.findIndex((b) => b.id === id)
          if (boardIndex === -1) return
          const board = boards[boardIndex]
          boards[boardIndex] = { ...board, ...changes }
          set({ boards })
        },
        addMessageButton: (button: BoardButton) =>
          set({
            messageButtons: [...get().messageButtons, button],
          }),
        removeLastMessageButton: () =>
          set({
            messageButtons: get().messageButtons.slice(0, -1),
          }),
        clearMessageButtons: () =>
          set({
            messageButtons: [],
          }),
        toggleEditMode: () =>
          set({
            editMode: !get().editMode,
          }),
        setEditButtonId: (buttonId: string | undefined) =>
          set({
            editButtonId: buttonId,
          }),
        setSymbolSearchText: (text: string) =>
          set({
            symbolSearchText: text,
          }),
        addCustomMessage: (id: string, text: string) =>
          set({
            customMessages: {
              ...get().customMessages,
              [id]: text,
            },
          }),
        logEvent: (event: LogEvent, pageId: string, boardId: string) => {
          const { history, shouldLog } = get()
          if (!shouldLog) return
          const content = parseLogContent(event)
          const entry =
            history.find((e) => e.content === content) ?? generateEntry(content)
          const occurance = parseLogEvent(event, pageId, boardId)
          entry.occurrences.push(occurance)
          set({
            history: [...history.filter((e) => e.content !== content), entry],
          })
          console.log("LOG", occurance)
        },
        toggleShouldLog: () => {
          set({ shouldLog: !get().shouldLog })
        },
        deleteLogs: () => {
          set({ history: [] })
        },
      },
    }),
    {
      name: "pagesets",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              ![
                "actions",
                "initialised",
                "customMessages",
                "previousPageIds",
                "editMode",
              ].includes(key),
          ),
        ),
      onRehydrateStorage: (state) => {
        return () => state.actions.setLoaded(true)
      },
    },
  ),
)

export const useBoardsLoaded = () => useStore((s) => s.loaded)
export const useBoards = () => useStore((s) => s.boards)
export const useMessageButtons = () => useStore((s) => s.messageButtons)
export const useEditMode = () => useStore((s) => s.editMode)
export const useEditButtonId = () => useStore((s) => s.editButtonId)
export const useSymbolSearchText = () => useStore((s) => s.symbolSearchText)
export const useCustomMessages = () => useStore((s) => s.customMessages)
export const useHistory = () => useStore((s) => s.history)
export const useShouldLog = () => useStore((s) => s.shouldLog)

export const usePagesetActions = () => useStore((s) => s.actions)
