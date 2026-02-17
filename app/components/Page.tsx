import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Sortable, { SortableGridDragEndCallback, type SortableGridRenderItem } from "react-native-sortables";
import { EditTile } from "../[board]";
import { useSpeak } from "../stores/audio";
import { useEditMode, usePagesetActions } from "../stores/boards";
import { useGoHomeOnPress, usePlayOnPress } from "../stores/prefs";
import { BoardButton, BoardPage } from "../utils/types";
import { uuid } from "../utils/uuid";
import Tile from "./Tile";
import TileEditor from "./TileEditor";

const pagePadding = 10
const rowGap = 10
const colGap = 10
const getRowHeight = (pageHeight: number, rows: number) => (pageHeight - pagePadding*2 - (rowGap * (rows-1))) / rows
const getGridPosition = (index: number, rows: number, cols: number) => {
  const row = Math.floor(index / cols)
  const col = index - row*cols
  return { row, col }
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
  const editSheet = useRef<TrueSheet>(null)
  const [pageHeight, setPageHeight] = useState(0)
  const [editTile, setEditTile] = useState<EditTile | undefined>()
  const editTileRef = useRef<EditTile | undefined>(editTile)
  const editMode = useEditMode()
  const playOnPress = usePlayOnPress()
  const goHomeOnPress = useGoHomeOnPress()
  const speak = useSpeak()
  const { setCurrentPageId, addMessageButtonId, setSymbolSearchText } = usePagesetActions()
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const rowHeight = getRowHeight(pageHeight, rows)
  if (!rows || !cols) return <></>

  const handleLayout = (event: LayoutChangeEvent) => setPageHeight(event.nativeEvent.layout.height)

  const grid = page.grid.flat() as (BoardButton | null)[]

  const onButtonPress = (button: BoardButton, index: number) => {
    if (editMode) {
      setEditTile({button, index})
      setSymbolSearchText(button.label)
      editSheet.current?.present()
    } else if (button.semanticAction?.intent === "SPEAK_TEXT") {
      if (playOnPress) speak(button.semanticAction.text ?? button.message)
      addMessageButtonId(button.id)
      if (goHomeOnPress && homePageId) setCurrentPageId(homePageId)
    } else if (button.semanticAction?.intent === "NAVIGATE_TO" && button.semanticAction.targetId) {
      setCurrentPageId(button.semanticAction.targetId)
    }
  }

  const renderButton = useCallback<SortableGridRenderItem<BoardButton | null>>(({item, index}) => item
    ? <Tile
        button={item}
        onPress={onButtonPress}
        height={rowHeight}
        index={index}
      />
    : <View style={{ height: rowHeight }} />
  , [rowHeight, onButtonPress])
  
  const handleDragEnd: SortableGridDragEndCallback<BoardButton | null> = (result) => {
    const flatGrid = result.data
    const grid = []
    while (flatGrid.length) grid.push(flatGrid.splice(0, cols))
    savePage({...page, grid})
  }

  useEffect(() => { editTileRef.current = editTile }, [editTile])
  const saveEditTile = () => {
    const tile = editTileRef.current
    if (!tile) return undefined
    const { row, col } = getGridPosition(tile.index, rows, cols)
    const newGrid = [...page.grid]
    newGrid[row][col] = tile.button
    savePage({
      ...page,
      buttons: [
        ...page.buttons.filter(b => b.id !== tile.button.id),
        tile.button
      ],
      grid: newGrid
    })
    setEditTile(undefined)
  }

  return <>
    <View
      style={{
        ...styles.container,
        borderWidth: editMode ? 6 : 0,
        padding: editMode ? pagePadding - 6 : pagePadding
      }}
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
  sheet: {
    minHeight: '50%'
  },
  container: {
    height: '100%',
    width: '100%',
    gap: 10,
    borderStyle: 'dashed'
  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    gap: 10
  }
})
