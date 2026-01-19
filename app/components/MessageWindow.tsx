import { Home, Menu } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { handleError } from "../utils/error";

export default function MessageWindow({
  onNavigateHome,
}: {
  onNavigateHome: () => void;
}) {
  return (
    <View style={{
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: 'white',
      padding: 10
    }}>
      <View>
        <Pressable
          style={styles.button}
          onPress={onNavigateHome}
        >
          <Home size={30} />
        </Pressable>
      </View>
      <View>
        <Pressable
          style={styles.button}
          onPress={() => handleError('open settings')}
        >
          <Menu size={30} />
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