import { GridsetProcessor } from '@willwade/aac-processors/browser';
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Button, View } from "react-native";

export default function Index() {
  const handleOpenFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
    const fileName = result.assets?.at(0)
    if (!fileName) return console.debug("No files selected")
    const file = new File(fileName.uri)
    const buffer = await file.arrayBuffer()
    const processor = new GridsetProcessor();
    const tree = await processor.loadIntoTree(buffer);
    console.log(tree)
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Open OBF file" onPress={handleOpenFile}/>
    </View>
  );
}
