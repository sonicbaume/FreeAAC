import { AACButton, AACPage } from "@willwade/aac-processors/browser";
import { useCallback, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from "react-native-sortables";
import { uuid } from "../utils/uuid";
import Tile from "./Tile";

const pagePadding = 10
const rowGap = 10
const colGap = 10
const getRowHeight = (pageHeight: number, rows: number) => (pageHeight - pagePadding*2 - (rowGap * (rows-1))) / rows

export default function Page({
  page,
  homePageId,
}: {
  page: AACPage;
  homePageId?: string;
}) {
  const [pageHeight, setPageHeight] = useState(0)
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const rowHeight = getRowHeight(pageHeight, rows)
  if (!rows || !cols) return <></>

  const handleLayout = (event: LayoutChangeEvent) => setPageHeight(event.nativeEvent.layout.height)

  const grid = page.grid.flat()

  const renderButton = useCallback<SortableGridRenderItem<AACButton | null>>(({item}) => item
    ? <Tile
        button={item}
        homePageId={homePageId}
        height={rowHeight}
      />
    : <View style={{ height: rowHeight }} />
  , [rowHeight])

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Sortable.Grid
        columns={cols}
        data={grid}
        renderItem={renderButton}
        rowGap={rowGap}
        columnGap={colGap}
        sortEnabled={false}
        keyExtractor={item => item?.id ?? uuid()}
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
    padding: pagePadding
  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    gap: 10
  }
})