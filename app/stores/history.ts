import {
  HistoryEntry,
  HistoryOccurrence,
} from "@willwade/aac-processors/analytics"
import { nanoid } from "nanoid/non-secure"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { zustandStorage } from "./middleware"

type LogEvent = Omit<HistoryOccurrence, "timestamp">

interface HistoryState {
  entries: HistoryEntry[]
  shouldLog: boolean
  actions: {
    logEvent(content: string, occurance: LogEvent): void
    toggleShouldLog(): void
    deleteLogs(): void
  }
}

const generateEntry = (content: string): HistoryEntry => {
  return {
    id: nanoid(),
    content,
    occurrences: [],
    source: "OBL",
  }
}

const useStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      shouldLog: false,
      actions: {
        logEvent: (content: string, occurance: LogEvent) => {
          const { entries, shouldLog } = get()
          if (!shouldLog) return
          const entry =
            entries.find((e) => e.content === content) ?? generateEntry(content)
          entry.occurrences.push({
            ...occurance,
            timestamp: new Date(),
          })
          set({
            entries: [...entries.filter((e) => e.content !== content), entry],
          })
          console.log("Added log entry", entry)
        },
        toggleShouldLog: () => {
          set({ shouldLog: !get().shouldLog })
        },
        deleteLogs: () => {
          set({ entries: [] })
        },
      },
    }),
    {
      name: "history",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !["actions"].includes(key)),
        ),
    },
  ),
)

export const useHistoryEntries = () => useStore((s) => s.entries)
export const useShouldLog = () => useStore((s) => s.shouldLog)

export const useHistoryActions = () => useStore((s) => s.actions)
