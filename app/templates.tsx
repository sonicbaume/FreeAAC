import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{paddingBottom: insets.bottom}}>
        {loading && <ActivityIndicator size="large" />}
        {!loading && templates.map((template, i) => (
          <BoardCard
            key={i}
            board={template}
            onSelect={() => loadTemplate(template)} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20
  }
})