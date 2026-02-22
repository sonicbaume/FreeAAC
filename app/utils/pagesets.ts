import { BoardTree } from "./types"

export const getHomePageId = (tree: BoardTree): string => {
  const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
  if (!(defaultPageId in tree.pages)) throw new Error("Could not find default page")
  return defaultPageId
}
