import { AACPage } from "@willwade/aac-processors/browser";
import { StyleSheet, View } from "react-native";
import Tile from "./Tile";

export default function Page({
  page,
  homePageId,
}: {
  page: AACPage;
  homePageId?: string;
}) {
  const rows = page.grid.length
  const cols = page.grid.at(0)?.length
  if (!rows || !cols) return <></>

  return (
    <View style={styles.container}>
      {page.grid.map((row, rowIndex) =>
       <View key={rowIndex} style={styles.row}>
        {row.map((col, colIndex) => col
        ? <Tile
            key={`${rowIndex}_${colIndex}`}
            button={col}
            homePageId={homePageId}
          />
        : <View
            key={`${rowIndex}_${colIndex}`}
            style={{ flex: 1 }}
          ></View>
        )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    gap: 10,
    padding: 10
  },
  row: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    gap: 10
  }
})