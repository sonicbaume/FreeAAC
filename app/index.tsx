
import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBoards, usePagesetActions } from "./stores/boards";
import { handleError } from "./utils/error";
import { loadBoard, selectFile } from "./utils/file";

export default function Index() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const boards = useBoards()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  const openFile = async () => {
    try {
      const {id, uri} = await selectFile()
      startLoading(async () => {
        const tree = await loadBoard(uri)
        addBoard({
          id,
          uri,
          name: tree.metadata.name || 'Untitled board',
        })
        router.push({ pathname: '/[board]', params: { board: id } })
      })
    } catch (e) {
      handleError(e)
    }
  }

  return <>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingBottom: insets.bottom }}>
      <View style={{ width: 400, maxWidth: '100%', padding: 20, gap: 20 }}>
        {boards.length > 0 && <>
        <Text style={{ fontSize: 18 }}>My boards</Text>
        <FlatList
          data={boards}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => {
                router.push({ pathname: '/[board]', params: { board: item.id } })
              }}
            />
          )}
        />
        </>}
        {loading && <ActivityIndicator size="large" />}
        {!loading && <>
          <Button title="View templates" onPress={() => router.push("/templates")} />
          <Button title="Import board" onPress={openFile}/>
        </>}
      </View>
    </View>
  </>
}
