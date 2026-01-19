import { Button, View } from "react-native";
import Page from "./components/Page";
import { useCurrentPage, usePageActions } from "./stores/page";
import { selectFile } from "./utils/file";

export default function Index() {
  const currentPage = useCurrentPage()
  const { addPage, setCurrentPage } = usePageActions()
  const handleOpenFile = () => selectFile(page => {
    addPage(page)
    setCurrentPage(page)
  })
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {currentPage && <Page page={currentPage} />}
      {!currentPage && <Button title="Import board" onPress={handleOpenFile}/>}
    </View>
  );
}
