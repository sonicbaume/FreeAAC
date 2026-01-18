import { AACPage, ObfProcessor } from "@willwade/aac-processors/browser";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { useState } from "react";
import { Button, View } from "react-native";

export default function Index() {
  const [page, setPage] = useState<AACPage>()

  const handleOpenFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const fileName = result.assets?.at(0)
    if (!fileName) return console.debug("No files selected")
    const file = new File(fileName.uri)
    const buffer = await file.arrayBuffer()
    const processor = new ObfProcessor();
    const tree = await processor.loadIntoTree(buffer);
    if (Object.keys(tree.pages).length < 1) return
    const defaultPageId = tree.metadata.defaultHomePageId ?? Object.keys(tree.pages)[0]
    if (!(defaultPageId in tree.pages)) return
    setPage(tree.pages[defaultPageId])
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!page &&
      <Button title="Open OBF file" onPress={handleOpenFile}/>
      }
    </View>
  );
}
