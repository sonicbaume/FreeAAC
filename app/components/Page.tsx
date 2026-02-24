import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { AACSemanticIntent } from "@willwade/aac-processors/browser";
import { nanoid } from "nanoid/non-secure";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Sortable, { SortableGridDragEndCallback, type SortableGridRenderItem } from "react-native-sortables";
import { EditTile } from "../[board]";
import { useSpeak } from "../stores/audio";
import { useEditMode, usePagesetActions } from "../stores/boards";
import { useGoHomeOnPress, usePlayOnPress } from "../stores/prefs";
import { GAP, PADDING, useTheme } from "../utils/theme";
import { BoardButton, BoardPage } from "../utils/types";
import { uuid } from "../utils/uuid";
import Tile from "./Tile";
import TileAdd from "./TileAdd";
import TileEditor from "./TileEditor";

const pagePadding = PADDING.lg
const rowGap = GAP.lg
const colGap = GAP.lg
const getRowHeight = (pageHeight: number, rows: number) => (pageHeight - pagePadding*2 - (rowGap * (rows-1))) / rows
const getGridPosition = (index: number, rows: number, cols: number) => {
  const row = Math.floor(index / cols)
  const col = index - row*cols
  return { row, col }
}

const generateNewButton = (pageId: string): BoardButton => {
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

export default function Page({
  page,
  savePage,
  homePageId,
  pageNames,
}: {
  page: BoardPage;
  savePage: (page: BoardPage) => void;
  homePageId?: string;
  pageNames: { id: string, name: string }[];
}) {
  const theme = useTheme()
  const editSheet = useRef<TrueSheet>(null)
  const [pageHeight, setPageHeight] = useState(0)
  const [editTile, setEditTile] = useState<EditTile | undefined>()
  const editTileRef = useRef<EditTile | undefined>(editTile)
  const pageRef = useRef<BoardPage>(page)
  const editMode = useEditMode()
  const playOnPress = usePlayOnPress()
  const goHomeOnPress = useGoHomeOnPress()
  const speak = useSpeak()
  const { setCurrentPageId, addMessageButtonId, setSymbolSearchText } = usePagesetActions()
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const rowHeight = getRowHeight(pageHeight, rows)
  if (!rows || !cols) return <></>

  const handleLayout = (event: LayoutChangeEvent) =>
    setPageHeight(event.nativeEvent.layout.height)

  const grid = page.grid.flat() as (BoardButton | null)[]

  const addButton = (index: number) => {
    setEditTile({ button: generateNewButton(page.id), image: undefined, index })
    setSymbolSearchText('')
    editSheet.current?.present()
  }

  const onButtonPress = (button: BoardButton, index: number) => {
    if (editMode) {
      setEditTile({button, image: page.images?.find(i => i.url === button.image), index})
      setSymbolSearchText(button.label)
      editSheet.current?.present()
    } else if (button.semanticAction?.intent === AACSemanticIntent.SPEAK_TEXT) {
      if (playOnPress) speak(button.semanticAction.text ?? button.message)
      addMessageButtonId(button.id)
      if (goHomeOnPress && homePageId) setCurrentPageId(homePageId)
    } else if (button.semanticAction?.intent === AACSemanticIntent.NAVIGATE_TO && button.semanticAction.targetId) {
      setCurrentPageId(button.semanticAction.targetId)
    }
  }

  const renderButton = useCallback<SortableGridRenderItem<BoardButton | null>>(({item, index}) => {
    if (item) return (
      <Tile
        button={item}
        onPress={onButtonPress}
        height={rowHeight}
        index={index}
      />
    )
    if (editMode) return <TileAdd height={rowHeight} onPress={() => addButton(index)} />
    return <View style={{ height: rowHeight }} />
  }, [rowHeight, onButtonPress, editMode])
  
  const handleDragEnd: SortableGridDragEndCallback<BoardButton | null> = (result) => {
    const flatGrid = result.data
    const grid = []
    while (flatGrid.length) grid.push(flatGrid.splice(0, cols))
    savePage({...page, grid})
  }

  useEffect(() => { editTileRef.current = editTile }, [editTile])
  useEffect(() => { pageRef.current = page }, [page])
  const saveEditTile = () => {
    const tile = {...editTileRef.current}
    const page = pageRef.current
    if (!tile || tile.index === undefined) return undefined
    if (tile.button && !tile.button.label) return undefined
    const { row, col } = getGridPosition(tile.index, rows, cols)
    const otherImages = page.images?.filter(i => i.url !== tile.image?.url) ?? []
    const newImages = tile.image
      ? [...otherImages, tile.image]
      : otherImages
    if (tile.button && tile.image) {
      tile.button = {
        ...tile.button,
        image: tile.image.url,
        parameters: {...tile.button.parameters, image_id: tile.image.id}
      }
    }
    const newGrid = [...page.grid]
    newGrid[row][col] = tile.button ?? null
    savePage({
      ...page,
      buttons: newGrid.flat().filter(b => b !== null),
      grid: newGrid,
      images: newImages
    })
    setEditTile(undefined)
  }

  return <>
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderWidth: editMode ? 6 : 0,
          borderColor: theme.outline,
          padding: editMode ? pagePadding - 6 : pagePadding
        }
      ]}
      onLayout={handleLayout}
    >
      <Sortable.Grid
        columns={cols}
        data={grid}
        renderItem={renderButton}
        rowGap={rowGap}
        columnGap={colGap}
        sortEnabled={editMode}
        keyExtractor={item => item?.id ?? uuid()}
        onDragEnd={handleDragEnd}
        itemsLayoutTransitionMode="reorder"
      />
    </View>
    <TileEditor
      ref={editSheet}
      tile={editTile}
      setTile={setEditTile}
      onClose={saveEditTile}
      pageNames={pageNames}
    />
  </>
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    gap: GAP.lg,
    borderStyle: 'dashed'
  },
})
