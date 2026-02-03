import { useRouter } from "expo-router";
import { useCallback, useTransition } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Sortable, { SortableGridRenderItem } from "react-native-sortables";
import BoardCard from "./components/BoardCard";
import { usePagesetActions } from "./stores/boards";
import { BoardTemplate, templates } from "./utils/consts";
import { handleError } from "./utils/error";
import { getFileExt, saveFile } from "./utils/file";
import { uuid } from "./utils/uuid";

export default function Templates () {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [loading, startLoading] = useTransition()
  const { addBoard } = usePagesetActions()

  const loadTemplate = (template: BoardTemplate) => {
    startLoading(async () => {
      try {
        const response = await fetch(template.url)
        const data = await response.arrayBuffer()
        const ext = getFileExt(template.url.split('/').slice(-1)[0])
        const id = uuid()
        const fileName = `${id}.${ext}`
        const uri = await saveFile(fileName, data, 'document')
        addBoard({ id, uri, name: template.name})
        router.replace({ pathname: '/[board]', params: { board: id } })
      } catch (e) {
        handleError(e)
      }
    })
  }

  const renderTemplate = useCallback<SortableGridRenderItem<BoardTemplate>>((item) => (
    <BoardCard
      board={item.item}
      onSelect={() => loadTemplate(item.item)}
    />
  ), [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ width: '100%', maxWidth: 600, paddingHorizontal: 20 }}>
        {loading && <ActivityIndicator size="large" />}
        {!loading && 
        <Sortable.Grid
          data={templates}
          renderItem={renderTemplate}
          columns={2}
          sortEnabled={false}
          rowGap={20}
          keyExtractor={item => item.url}
        />}
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