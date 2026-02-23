import { StyleSheet, Text, View } from "react-native";

export default function PageTitle({
  title
}: {
  title: string | undefined
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingLeft: 20,
    color: 'lightgrey',
    userSelect: 'none',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee'
  }
})