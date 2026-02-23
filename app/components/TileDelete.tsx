import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function TileDelete ({
  onPress
}: {
  onPress: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  return <>
    {!showConfirm &&
    <Pressable
      style={[styles.button, styles.deleteButton]}
      onPress={() => setShowConfirm(true)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </Pressable>
    }
    {showConfirm &&
    <View style={styles.confirmContainer}>
      <Text>
        Are you sure you want to delete?
      </Text>
      <View style={styles.confirmButtonContainer}>
        <Pressable style={styles.button} onPress={() => setShowConfirm(false)}>
          <Text>No</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.confirmButton]} onPress={onPress}>
          <Text>Yes</Text>
      </Pressable>
      </View>
    </View>
    }
  </>
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  deleteButton: {
    borderColor: 'red',
  },
  deleteButtonText: {
    color: 'red',
  },
  confirmButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: '50%',
    gap: 10
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-between',
  },
  confirmButton: {
    borderColor: 'red',
  }
})