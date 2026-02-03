import { useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Sortable, { SortableGridDragEndCallback, type SortableGridRenderItem } from "react-native-sortables";
import { useEditMode } from "../stores/boards";
import { BoardButton, BoardPage } from "../utils/types";
import { uuid } from "../utils/uuid";
import Tile from "./Tile";

const pagePadding = 10
const rowGap = 10
const colGap = 10
const getRowHeight = (pageHeight: number, rows: number) => (pageHeight - pagePadding*2 - (rowGap * (rows-1))) / rows

export default function Page({
  page,
  savePage,
  homePageId,
}: {
  page: BoardPage;
  savePage: (page: BoardPage) => void;
  homePageId?: string;
}) {
  const [pageHeight, setPageHeight] = useState(0)
  const editMode = useEditMode()
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const rowHeight = getRowHeight(pageHeight, rows)
  if (!rows || !cols) return <></>

  const handleLayout = (event: LayoutChangeEvent) => setPageHeight(event.nativeEvent.layout.height)

  const grid = page.grid.flat()

  const renderButton = useCallback<SortableGridRenderItem<BoardButton | null>>(({item}) => item
    ? <Tile
        button={item}
        homePageId={homePageId}
        height={rowHeight}
      />
    : <View style={{ height: rowHeight }} />
  , [rowHeight])
  
  const handleDragEnd: SortableGridDragEndCallback<BoardButton | null> = (result) => {
    const flatGrid = result.data
    const grid = []
    while (flatGrid.length) grid.push(flatGrid.splice(0, cols))
    savePage({...page, grid})
  }

  return (
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
  )
}

const styles = StyleSheet.create({
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