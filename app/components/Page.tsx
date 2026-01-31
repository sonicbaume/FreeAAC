import { useHeaderHeight } from "@react-navigation/elements";
import { AACButton, AACPage } from "@willwade/aac-processors/browser";
import { useCallback } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from "react-native-sortables";
import Tile from "./Tile";

const pagePadding = 10
const rowGap = 10

export default function Page({
  page,
  homePageId,
}: {
  page: AACPage;
  homePageId?: string;
}) {
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const { height } = useWindowDimensions()
  const rowHeight = ((height - insets.top - insets.bottom - headerHeight - 60 - pagePadding*2) / rows) - rowGap
  if (!rows || !cols) return <></>

  const grid = page.grid.flat()

  const renderButton = useCallback<SortableGridRenderItem<AACButton | null>>(({item}) =>
    item ? <Tile button={item} homePageId={homePageId} height={rowHeight} /> : <View style={{ height: rowHeight }}  />
  , [rowHeight])

  return (
    <View style={styles.container}>
      <Sortable.Grid
        columns={cols}
        data={grid}
        renderItem={renderButton}
        rowGap={rowGap}
        columnGap={10}
        sortEnabled={false}
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