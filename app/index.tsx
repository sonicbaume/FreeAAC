import { useRouter } from "expo-router";
import { Button, View } from "react-native";
import { usePagesetActions } from "./stores/pagesets";
import { handleError } from "./utils/error";
import { selectFile } from "./utils/file";

export default function Index() {
  const router = useRouter()
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
    <View style={{ flex: 1 }}>
      <Button title="Import board" onPress={handleOpenFile}/>
    </View>
  </>
}
