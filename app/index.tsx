import { AACPage } from "@willwade/aac-processors/browser";
import { useState } from "react";
import { Button, View } from "react-native";
import Page from "./components/Page";
import { selectFile } from "./utils/file";

export default function Index() {
  const [page, setPage] = useState<AACPage>()
  const handleOpenFile = () => selectFile(page => setPage(page))
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {page && <Page page={page} />}
      {!page && <Button title="Open OBF file" onPress={handleOpenFile}/>}
    </View>
  );
}
