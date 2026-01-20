import { useRouter } from "expo-router";
import { Button, FlatList, Text, View } from "react-native";
import { usePagesetActions, useTreeFiles } from "./stores/pagesets";
import { handleError } from "./utils/error";
import { selectFile } from "./utils/file";

export default function Index() {
  const router = useRouter()
  const treeFiles = useTreeFiles()
  const { addTreeFile } = usePagesetActions()

  const handleOpenFile = async () => {
    try {
      const treeFileUri = await selectFile()
      addTreeFile(treeFileUri)
      router.push({ pathname: '/[board]', params: { board: treeFileUri } })
    } catch (e) {
      handleError(e)
    }
  }

  return <>
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <View style={{ width: 400, maxWidth: '100%', padding: 20, gap: 20 }}>
        <Text style={{ fontSize: 18 }}>My boards</Text>
        <FlatList
          data={treeFiles}
          keyExtractor={item => item}
          renderItem={({ item }) => (
          <Button
            title={item}
            onPress={() => {
              router.push({ pathname: '/[board]', params: { board: item } })
            }}
          />
        )}/>
        <Button title="Import board" onPress={handleOpenFile}/>
      </View>
    </View>
  </>
}
