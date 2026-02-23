import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BoardCard from "./components/BoardCard";
import { usePagesetActions } from "./stores/boards";
import { BoardTemplate, templates } from "./utils/consts";
import { handleError } from "./utils/error";
import { downloadFile } from "./utils/io";
import { GAP, PADDING } from "./utils/theme";

export default function Templates () {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [loading, startLoading] = useTransition()
  const { addBoard } = usePagesetActions()

  const loadTemplate = (template: BoardTemplate) => {
    startLoading(async () => {
      try {
        const {id, fileName} = await downloadFile(template.url)
        addBoard({ id, uri: fileName, name: template.name})
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
    paddingVertical: PADDING.xl,
    gap: GAP.xl,
  }
})