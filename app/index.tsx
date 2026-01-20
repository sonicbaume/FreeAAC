
import { useRouter } from "expo-router";
import { Button, FlatList, Text, View } from "react-native";
import { useBoards, usePagesetActions } from "./stores/boards";
import { handleError } from "./utils/error";
import { loadBoard, selectFile } from "./utils/file";

export default function Index() {
  const router = useRouter()
  const boards = useBoards()
  const { addBoard } = usePagesetActions()

  const handleOpenFile = async () => {
    try {
      const {id, uri} = await selectFile()
      console.log({id, uri})
      const tree = await loadBoard(uri)
      addBoard({
        id,
        uri,
        name: tree.metadata.name || 'Untitled board',
      })
      router.push({ pathname: '/[board]', params: { board: id } })
    } catch (e) {
      handleError(e)
    }
  }

  return <>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
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
        )}/>
        </>}
        <Button title="Import board" onPress={handleOpenFile}/>
      </View>
    </View>
  </>
}
