import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from "react-native";
import { usePagesetActions } from "./stores/boards";
import { BoardTemplate, licenseImageMap, templates } from "./utils/consts";
import { getFileExt, saveFile } from "./utils/file";
import { uuid } from "./utils/uuid";

export default function Templates () {
  const router = useRouter()
  const [loading, startLoading] = useTransition()
  const { addBoard } = usePagesetActions()

  const loadTemplate = (template: BoardTemplate) => {
    startLoading(async () => {
      const response = await fetch(template.url)
      const data = await response.arrayBuffer()
      const ext = getFileExt(template.url.split('/').slice(-1)[0])
      const id = uuid()
      const fileName = `${id}.${ext}`
      const uri = await saveFile(fileName, data, 'document')
      addBoard({ id, uri, name: 'Sample board'})
      router.push({ pathname: '/[board]', params: { board: id } })
    })
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <ActivityIndicator size="large" />}
      {!loading && templates.map(template => (
        <View style={styles.card}>
          <View style={{ padding: 10, gap: 5}}>
            <Text style={{ fontSize: 20 }}>{template.name}</Text>
            <Text style={{ fontSize: 14 }}>{template.author}</Text>
            <Image source={licenseImageMap.light[template.license]} />
          </View>
          <Button title="Load" onPress={() => loadTemplate(template)} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
    width: 200,
    maxWidth: '50%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  }
})

