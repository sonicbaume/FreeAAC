import { AACSemanticIntent } from "@willwade/aac-processors/browser"
import { nanoid } from "nanoid/non-secure"
import { PageItem } from "../stores/boards"
import { BoardButton, BoardPage, BoardTree } from "./types"
import { uuid } from "./uuid"

export const getHomePageId = (tree: BoardTree): string => {
  const defaultPageId =
    tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
  if (!(defaultPageId in tree.pages))
    throw new Error("Could not find default page")
  return defaultPageId
}

export const generateNewButton = (pageId: string): BoardButton => {
  return {
    id: `${pageId}::${nanoid()}`,
    label: "",
    message: "",
    type: "SPEAK",
    action: { type: "SPEAK" },
    semanticAction: {
      intent: AACSemanticIntent.SPEAK_TEXT,
    },
  }
}

export const generateNewPage = (
  rows: number,
  cols: number,
  parentId: string | null,
  name = "New page",
): BoardPage => {
  const grid = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(undefined))
  return {
    id: uuid(),
    name,
    grid,
    parentId,
    buttons: [],
    images: [],
    sounds: [],
    pendingMutations: [],
  }
}

export const generateNewBoard = (
  rows: number,
  cols: number,
): {
  tree: BoardTree
  pages: PageItem[]
} => {
  const page = generateNewPage(rows, cols, null)
  const tree: BoardTree = {
    pages: {
      [page.id]: page,
    },
    metadata: {
      defaultHomePageId: page.id,
    },
    rootId: page.id,
    toolbarId: null,
    dashboardId: page.id,
  }
  return {
    tree,
    pages: [
      {
        id: page.id,
        name: page.name,
        path: `${page.id}.obf`,
      },
    ],
  }
}
