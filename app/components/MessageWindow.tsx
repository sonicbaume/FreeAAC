import { Menu } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { handleError } from "../utils/error";

export default function MessageWindow() {
  return (
    <View style={{
      height: 60,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: 'white',
      padding: 10
    }}>
      <View>
        
      </View>
      <View>
        <Pressable
          style={{ padding: 5}}
          onPress={() => handleError('open settings')}
        >
          <Menu size={30} />
        </Pressable>
      </View>
    </View>
  )
}