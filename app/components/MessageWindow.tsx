import { Home } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

export default function MessageWindow({
  navigateHome,
}: {
  navigateHome: () => void;
}) {
  return (
    <View style={{
      height: 60,
      flexDirection: "row",
      backgroundColor: 'white',
      padding: 10
    }}>
      <View>
        <Pressable
          style={styles.button}
          onPress={navigateHome}
        >
          <Home size={30} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 5
  }
})