
import { useRouter } from "expo-router";
import { useTransition } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBoards, usePagesetActions } from "./stores/boards";
import { handleError } from "./utils/error";
import { loadBoard, selectFile } from "./utils/file";
import { FONT_SIZE, GAP, PADDING, useTheme } from "./utils/theme";
export default function Index() {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const boards = useBoards()
  const { addBoard } = usePagesetActions()
  const [loading, startLoading] = useTransition()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    boardList: {
      width: 400,
      maxWidth: '100%',
      padding: PADDING.xl,
      gap: GAP.xl,
      backgroundColor: theme.surface,
    }
  })

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
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.boardList}>
        {boards.length > 0 && <>
        <Text style={{ fontSize: FONT_SIZE.lg }}>My boards</Text>
        <FlatList
          data={boards}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Button
              title={item.name}
              onPress={() => {
                router.push({
                  pathname: '/[board]',
                  params: { board: item.id }
                })
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
