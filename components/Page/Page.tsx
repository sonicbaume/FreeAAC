import { preloadImage } from "@/utils/cache"
import { tileSpacingWidthThreshold } from "@/utils/consts"
import { handleError } from "@/utils/error"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import {
  DndProvider,
  Draggable,
  DraggableGrid,
  UniqueIdentifier,
} from "@mgcrea/react-native-dnd"
import { AACSemanticIntent } from "@willwade/aac-processors/browser"
import { useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { LayoutChangeEvent, LayoutRectangle, View } from "react-native"
import { EditTile } from "../../app/[boardId]"
import { useSpeak } from "../../stores/audio"
import { useBoards, useEditMode, usePagesetActions } from "../../stores/boards"
import {
  useGoHomeOnPress,
  usePlayOnPress,
  useTileSpacing,
  useVocaliseLinkButtons,
} from "../../stores/prefs"
import { generateNewButton } from "../../utils/boards"
import { useTheme } from "../../utils/theme"
import { BoardButton, BoardPage } from "../../utils/types"
import Tile from "../Tile/Tile"
import TileAdd from "../Tile/TileAdd"
import TileEditor from "../Tile/TileEditor"

const getGridPosition = (index: number, rows: number, cols: number) => {
  const row = Math.floor(index / cols)
  const col = index - row * cols
  return { row, col }
}

const calculateSpacing = (tileSpacing: number, pageSize?: LayoutRectangle) => {
  if (!pageSize || pageSize.width >= tileSpacingWidthThreshold)
    return tileSpacing
  return tileSpacing / (tileSpacingWidthThreshold / pageSize.width)
}

const calculateTileSize = (
  pageSize: LayoutRectangle | undefined,
  rows: number | undefined,
  cols: number | undefined,
  spacing: number,
) => {
  if (!pageSize || !cols || !rows) return { width: 0, height: 0 }
  const colWidth = Math.floor(
    (pageSize.width - spacing * 2 - spacing * (cols - 1)) / cols,
  )
  const rowHeight = Math.floor(
    (pageSize.height - spacing * 2 - spacing * (rows - 1)) / rows,
  )
  return { colWidth, rowHeight }
}

export default function Page({
  page,
  savePage,
  homePageId,
  navigateToPage,
}: {
  page: BoardPage
  savePage: (page: BoardPage) => void
  homePageId?: string
  navigateToPage: (pageId: string) => void
}) {
  const theme = useTheme()
  const editSheet = useRef<TrueSheet>(null)
  const { boardId, pageId } = useLocalSearchParams()
  const boards = useBoards()
  const board = boards.find((b) => b.id === boardId)
  const [pageSize, setPageSize] = useState<LayoutRectangle>()
  const [editTile, setEditTile] = useState<EditTile | undefined>()
  const editTileRef = useRef<EditTile | undefined>(editTile)
  const pageRef = useRef<BoardPage>(page)
  const editMode = useEditMode()
  const playOnPress = usePlayOnPress()
  const goHomeOnPress = useGoHomeOnPress()
  const tileSpacing = useTileSpacing()
  const vocaliseLinkButtons = useVocaliseLinkButtons()
  const spacing = calculateSpacing(tileSpacing, pageSize)
  const speak = useSpeak()
  const { addMessageButton, setSymbolSearchText, logEvent } =
    usePagesetActions()

  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const { colWidth, rowHeight } = calculateTileSize(
    pageSize,
    rows,
    cols,
    spacing,
  )

  const grid = page.grid.flat()

  const handleLayout = (event: LayoutChangeEvent) =>
    setPageSize(event.nativeEvent.layout)

  const addButton = useCallback(
    (index: number) => {
      setEditTile({
        button: generateNewButton(page.id),
        image: undefined,
        index,
      })
      setSymbolSearchText("")
      editSheet.current?.present()
    },
    [page.id, setSymbolSearchText],
  )

  const logButtonPress = useCallback(
    (button: BoardButton, spoken: boolean) => {
      if (!button.semanticAction)
        return console.error("Button is missing semanticAction")
      const isLink =
        button.semanticAction.intent === AACSemanticIntent.NAVIGATE_TO
      logEvent(
        {
          type: isLink ? "navigate" : "button",
          button,
          spoken,
          playOnPress,
          goHomeOnPress: goHomeOnPress ? homePageId : undefined,
        },
        pageId as string,
        boardId as string,
      )
    },
    [boardId, goHomeOnPress, homePageId, logEvent, pageId, playOnPress],
  )

  const onButtonPress = useCallback(
    (button: BoardButton, index: number) => {
      if (!editMode && button.visibility && button.visibility === "Disabled") {
        return
      } else if (editMode) {
        setEditTile({
          button,
          image: page.images?.find((i) => i.url === button.image),
          index,
        })
        setSymbolSearchText(button.label)
        editSheet.current?.present()
      } else if (
        button.semanticAction?.intent === AACSemanticIntent.SPEAK_TEXT
      ) {
        if (playOnPress) speak(button.semanticAction.text ?? button.message)
        addMessageButton(button)
        if (goHomeOnPress && homePageId) navigateToPage(homePageId)
        logButtonPress(button, playOnPress)
      } else if (
        button.semanticAction?.intent === AACSemanticIntent.NAVIGATE_TO &&
        button.semanticAction.targetId
      ) {
        const targetPage = board?.pages?.find(
          (p) => p.path === button.semanticAction?.targetId,
        )
        if (!targetPage) {
          console.error("Could not find page ID", targetPage)
          return handleError("Could not find page ID")
        }
        if (vocaliseLinkButtons)
          speak(button.semanticAction.text ?? button.message)
        navigateToPage(targetPage.id)
        logButtonPress(button, vocaliseLinkButtons)
      }
    },
    [
      editMode,
      page.images,
      setSymbolSearchText,
      playOnPress,
      speak,
      addMessageButton,
      goHomeOnPress,
      homePageId,
      navigateToPage,
      logButtonPress,
      board?.pages,
      vocaliseLinkButtons,
    ],
  )

  const renderButton = useCallback(
    ({ item, index }: { item: BoardButton | null; index: number }) => {
      const isHidden = item && item.visibility && item.visibility === "Hidden"
      if (item && (editMode || !isHidden))
        return <Tile button={item} onPress={onButtonPress} index={index} />
      if (editMode && item === null)
        return <TileAdd onPress={() => addButton(index)} />
      return <View style={{ flex: 1 }} />
    },
    [editMode, onButtonPress, addButton],
  )

  const handleOrderChange = (order: UniqueIdentifier[]) => {
    const flatGrid = order.map((id) => grid[parseInt(id as string)])
    const newGrid = []
    while (flatGrid.length) newGrid.push(flatGrid.splice(0, cols))
    savePage({ ...page, grid: newGrid })
  }

  useEffect(() => {
    editTileRef.current = editTile
  }, [editTile])
  useEffect(() => {
    pageRef.current = page
  }, [page])
  const saveEditTile = () => {
    const tile = { ...editTileRef.current }
    const page = pageRef.current
    if (!tile || tile.index === undefined || !rows || !cols) return undefined
    if (tile.button && !tile.button.label) return undefined
    const { row, col } = getGridPosition(tile.index, rows, cols)
    const otherImages =
      page.images?.filter((i) => i.url !== tile.image?.url) ?? []
    const newImages = tile.image ? [...otherImages, tile.image] : otherImages
    if (tile.button && tile.image) {
      tile.button = {
        ...tile.button,
        image: tile.image.url,
        parameters: { ...tile.button.parameters, image_id: tile.image.id },
      }
      preloadImage(tile.image.url)
    }
    const newGrid = [...page.grid]
    newGrid[row][col] = tile.button ?? null
    savePage({
      ...page,
      buttons: newGrid.flat().filter((b) => b !== null),
      grid: newGrid,
      images: newImages,
    })
    setEditTile(undefined)
  }

  if (!rows || !cols) return <></>
  return (
    <>
      <View
        style={{
          flex: 1,
          borderStyle: "dashed",
          backgroundColor: theme.surface,
          borderWidth: editMode ? 6 : 0,
          borderColor: theme.outline,
          padding: editMode ? spacing - 6 : spacing,
          gap: spacing,
        }}
        onLayout={handleLayout}
      >
        {editMode && (
          <DndProvider>
            <DraggableGrid
              key={grid.map((item) => item?.id ?? "null").join(",")}
              direction="row"
              size={cols}
              gap={spacing}
              onOrderChange={handleOrderChange}
            >
              {grid.map((item, index) => (
                <Draggable
                  key={index}
                  id={index.toString()}
                  style={{
                    width: colWidth,
                    height: rowHeight,
                  }}
                >
                  {renderButton({ item, index })}
                </Draggable>
              ))}
            </DraggableGrid>
          </DndProvider>
        )}
        {!editMode &&
          Array.from({ length: rows }).map((_, row) => (
            <View
              key={row}
              style={{
                flexDirection: "row",
                gap: spacing,
                flex: 1,
              }}
            >
              {Array.from({ length: cols }).map((_, col) => {
                const index = row * cols + col
                const item = grid[index]
                return (
                  <View key={index} style={{ flex: 1 }}>
                    {renderButton({ item, index })}
                  </View>
                )
              })}
            </View>
          ))}
      </View>
      <TileEditor
        ref={editSheet}
        tile={editTile}
        setTile={setEditTile}
        onClose={saveEditTile}
      />
    </>
  )
}
