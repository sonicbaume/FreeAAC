import { ScrollView, StyleSheet, View } from "react-native";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";
import BoardCard from "./components/BoardCard";
import { BoardTemplate, templates } from "./utils/consts";
import { GAP, MAX_WIDTH, PADDING } from "./utils/theme";

export default function Templates () {
  const renderTemplate: SortableGridRenderItem<BoardTemplate> = (item) => (
    <BoardCard board={item.item} />
  )
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ width: '100%', maxWidth: MAX_WIDTH, paddingHorizontal: PADDING.xxl }}>
        <Sortable.Grid
          data={templates}
          renderItem={renderTemplate}
          columns={2}
          sortEnabled={false}
          rowGap={30}
          keyExtractor={item => item.url}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: PADDING.xl,
    gap: GAP.xl,
    paddingBottom: 200
  }
})