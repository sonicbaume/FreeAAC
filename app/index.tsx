
import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import { useBoards, usePagesetActions } from "./stores/boards";
import { sampleBoardUrl } from "./utils/consts";
import { handleError } from "./utils/error";
import { getFileExt, loadBoard, saveFile, selectFile } from "./utils/file";
import { uuid } from "./utils/uuid";

export default function Index() {
  const router = useRouter()
  const boards = useBoards()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  const openFile = async () => {
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

  const openSample = () => {
    startLoading(async () => {
      const response = await fetch(sampleBoardUrl)
      const data = await response.arrayBuffer()
      const ext = getFileExt(sampleBoardUrl.split('/').slice(-1)[0])
      const id = uuid()
      const fileName = `${id}.${ext}`
      const uri = await saveFile(fileName, data, 'document')
      addBoard({ id, uri, name: 'Sample board'})
      router.push({ pathname: '/[board]', params: { board: id } })
    })
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
        {loading && <ActivityIndicator size="large" />}
        {!loading && <>
          <Button title="Load sample board" onPress={openSample} />
          <Button title="Import board" onPress={openFile}/>
        </>}
      </View>
    </View>
  </>
}
