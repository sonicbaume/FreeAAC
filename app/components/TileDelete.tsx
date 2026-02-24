import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { GAP, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function TileDelete ({
  onPress
}: {
  onPress: () => void;
}) {
  const theme = useTheme()
  const [showConfirm, setShowConfirm] = useState(false)
  
  return <>
    {!showConfirm &&
    <Button
      variant="destructive"
      onPress={() => setShowConfirm(true)}
    >
      <Text style={{ color: theme.onError }}>Delete</Text>
    </Button>
    }
    {showConfirm &&
    <View style={styles.confirmContainer}>
      <Text>
        Are you sure you want to delete?
      </Text>
      <View style={styles.confirmButtonContainer}>
        <Button variant="outline" style={{ flex: 1 }} onPress={() => setShowConfirm(false)}>
          <Text style={{ color: theme.onSurface }}>No</Text>
        </Button>
        <Button variant="destructive" style={{ flex: 1 }} onPress={onPress}>
          <Text style={{ color: theme.onError }}>Yes</Text>
      </Button>
      </View>
    </View>
    }
  </>
}

const styles = StyleSheet.create({
  confirmButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: '50%',
    gap: GAP.lg
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.lg,
    justifyContent: 'space-between',
  },
})