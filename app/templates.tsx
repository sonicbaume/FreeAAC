import { ScrollView, StyleSheet, View } from "react-native"
import BoardCard from "./components/Board/BoardCard"
import { templates } from "./utils/consts"
import { GAP, MAX_WIDTH, PADDING, useTheme } from "./utils/theme"

export default function Templates() {
  const theme = useTheme()
  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.list}>
        {templates.map((template, i) => (
          <BoardCard key={i} board={template} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: PADDING.xl,
    gap: GAP.xl,
    paddingBottom: 200,
  },
  list: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: MAX_WIDTH,
    paddingHorizontal: PADDING.xxl,
    gap: GAP.xl,
  },
})
