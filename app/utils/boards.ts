import { AACSemanticIntent } from "@willwade/aac-processors/browser"
import { nanoid } from "nanoid/non-secure"
import { BoardButton, BoardPage, BoardTree } from "./types"

export const getHomePageId = (tree: BoardTree): string => {
  const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
  if (!(defaultPageId in tree.pages)) throw new Error("Could not find default page")
  return defaultPageId
}

export const generateNewButton = (pageId: string): BoardButton => {
  return {
    id: `${pageId}::${nanoid()}`,
    label: '',
    message: '',
    type: "SPEAK",
    action: { type: "SPEAK" },
    semanticAction: {
      intent: AACSemanticIntent.SPEAK_TEXT
    }
  }
}

export const generateNewPage = (
  rows: number,
  cols: number,
  parentId: string | null,
  name = "New page"
): BoardPage => {
  const grid = Array(rows).fill(null).map(() => Array(cols).fill(undefined))
  return {
    id: nanoid(),
    name,
    grid,
    parentId,
    buttons: [],
    images: [],
    sounds: [],
  }
}

export const generateNewBoard = (rows: number, cols: number): BoardTree => {
  const page = generateNewPage(rows, cols, null)
  return {
    pages: {
        [page.id]: page
    },
    metadata: {
      defaultHomePageId: page.id,
    },
    rootId: null,
    toolbarId: null,
    dashboardId: page.id,
  }
}