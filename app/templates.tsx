import { ScrollView, StyleSheet, View } from "react-native";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";
import BoardCard from "./components/BoardCard";
import { BoardTemplate, templates } from "./utils/consts";

export default function Templates () {
  const renderTemplate: SortableGridRenderItem<BoardTemplate> = (item) => (
    <BoardCard
      board={item.item}
    />
  )
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ width: '100%', maxWidth: 600, paddingHorizontal: 20 }}>
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
    paddingVertical: 20,
    gap: 20,
    paddingBottom: 200
  }
})