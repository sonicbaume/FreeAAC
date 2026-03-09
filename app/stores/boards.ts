import { HistoryEntry } from "@willwade/aac-processors/analytics"
import { nanoid } from "nanoid/non-secure"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { LogEvent, parseLogContent, parseLogEvent } from "../utils/logging"
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
  uri: string
  name: string
}

interface ButtonId {
  id: string
  pageId: string
}

interface PagesetsState {
  loaded: boolean
  boards: Board[]
  currentBoardId: string | undefined
  currentPageId: string | undefined
  previousPageIds: string[]
  messageButtonsIds: ButtonId[]
  editMode: boolean
  editButtonId: string | undefined
  symbolSearchText: string
  customMessages: Record<string, string>
  history: HistoryEntry[]
  shouldLog: boolean
  actions: {
    setLoaded: (loaded: boolean) => void
    setCurrentBoardId: (boardId: string | undefined) => void
    navigateToPage: (pageId: string) => void
    navigateBack: () => void
    addBoard: (boards: Board) => void
    removeBoard: (id: string) => void
    renameBoard: (id: string, name: string) => void
    addMessageButtonId: (buttonId: ButtonId) => void
    removeLastMessageButtonId: () => void
    clearMessageButtonIds: () => void
    toggleEditMode: () => void
    setEditButtonId: (buttonId: string | undefined) => void
    setSymbolSearchText: (text: string) => void
    addCustomMessage: (id: string, text: string) => void
    logEvent(event: LogEvent): void
    toggleShouldLog(): void
    deleteLogs(): void
  }
}

const useStore = create<PagesetsState>()(
  persist(
    (set, get) => ({
      loaded: false,
      boards: [],
      currentBoardId: undefined,
      currentPageId: undefined,
      previousPageIds: [],
      messageButtonsIds: [],
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
        setCurrentBoardId: (boardId) =>
          set({
            currentBoardId: boardId,
          }),
        navigateToPage: (pageId: string) => {
          const { previousPageIds, currentPageId } = get()
          if (currentPageId) previousPageIds.push(currentPageId)
          set({
            currentPageId: pageId,
            previousPageIds,
          })
          console.log({ previousPageIds })
        },
        navigateBack: () => {
          const previousPageIds = get().previousPageIds
          const currentPageId = previousPageIds.pop()
          set({
            currentPageId,
            previousPageIds,
          })
          console.log({ previousPageIds })
        },
        addBoard: (board: Board) =>
          set({
            boards: [...get().boards, board],
          }),
        removeBoard: (id: string) =>
          set({
            boards: get().boards.filter((board) => board.id !== id),
          }),
        renameBoard: (id: string, name: string) => {
          const boards = [...get().boards]
          const board = boards.find((b) => b.id === id)
          if (board) board.name = name
          set({ boards })
        },
        addMessageButtonId: (buttonId: ButtonId) =>
          set({
            messageButtonsIds: [...get().messageButtonsIds, buttonId],
          }),
        removeLastMessageButtonId: () =>
          set({
            messageButtonsIds: get().messageButtonsIds.slice(0, -1),
          }),
        clearMessageButtonIds: () =>
          set({
            messageButtonsIds: [],
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
        logEvent: (event: LogEvent) => {
          const { history, shouldLog, currentPageId, currentBoardId } = get()
          if (!shouldLog) return
          const content = parseLogContent(event)
          const entry =
            history.find((e) => e.content === content) ?? generateEntry(content)
          const occurance = parseLogEvent(event, currentPageId, currentBoardId)
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
export const useCurrentBoardId = () => useStore((s) => s.currentBoardId)
export const useCurrentPageId = () => useStore((s) => s.currentPageId)
export const useMessageButtonsIds = () => useStore((s) => s.messageButtonsIds)
export const useEditMode = () => useStore((s) => s.editMode)
export const useEditButtonId = () => useStore((s) => s.editButtonId)
export const useSymbolSearchText = () => useStore((s) => s.symbolSearchText)
export const useCustomMessages = () => useStore((s) => s.customMessages)
export const useHistory = () => useStore((s) => s.history)
export const useShouldLog = () => useStore((s) => s.shouldLog)

export const usePagesetActions = () => useStore((s) => s.actions)
