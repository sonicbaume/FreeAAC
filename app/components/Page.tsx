import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useCallback, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Sortable, { SortableGridDragEndCallback, type SortableGridRenderItem } from "react-native-sortables";
import { useSpeak } from "../stores/audio";
import { useEditMode, usePagesetActions } from "../stores/boards";
import { useGoHomeOnPress, usePlayOnPress } from "../stores/prefs";
import { handleError } from "../utils/error";
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
}: {
  page: BoardPage;
  savePage: (page: BoardPage) => void;
  homePageId?: string;
}) {
  const editSheet = useRef<TrueSheet>(null)
  const [pageHeight, setPageHeight] = useState(0)
  const [editButton, setEditButton] = useState<{
    button: BoardButton,
    index: number
  }>()
  const editMode = useEditMode()
  const playOnPress = usePlayOnPress()
  const goHomeOnPress = useGoHomeOnPress()
  const speak = useSpeak()
  const { setCurrentPageId, addMessageButtonId } = usePagesetActions()
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const rowHeight = getRowHeight(pageHeight, rows)
  if (!rows || !cols) return <></>

  const handleLayout = (event: LayoutChangeEvent) => setPageHeight(event.nativeEvent.layout.height)

  const grid = page.grid.flat()

  const onButtonPress = (button: BoardButton, index: number) => {
    if (editMode) {
      setEditButton({ button, index })
      editSheet.current?.present()
    } else if (button.action?.type === "SPEAK") {
      if (playOnPress) speak(button.action.message ?? button.message)
      addMessageButtonId(button.id)
      if (goHomeOnPress && homePageId) setCurrentPageId(homePageId)
    } else if (button.action?.type === "NAVIGATE" && button.action.targetPageId) {
      setCurrentPageId(button.action.targetPageId)
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

  const saveEdit = useCallback(() => {
    if (!editButton) return handleError("No button selected")
    const { row, col } = getGridPosition(editButton.index, rows, cols)
    const newGrid = [...page.grid]
    newGrid[row][col] = editButton.button
    savePage({
      ...page,
      buttons: [
        ...page.buttons.filter(b => b.id !== editButton.button.id),
        editButton.button
      ],
      grid: newGrid
    })
    setEditButton(undefined)
  }, [editButton])

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
      />
    </View>
    <TrueSheet
      ref={editSheet}
      detents={[0.5, 1]}
      onWillDismiss={saveEdit}
    >
      <TileEditor
        button={editButton?.button}
        setButton={button => editButton && setEditButton({...editButton, button})}
      />
    </TrueSheet>
  </>
}

const styles = StyleSheet.create({
  sheet: {
    minHeight: '50%'
  },
  container: {
    display: 'flex',
    flex: 1,
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
