import { Check, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useEditMode } from "../stores/boards";

export default function PageTitle({
  title,
  onChange,
}: {
  title: string | undefined,
  onChange: (title: string) => void;
}) {
  const [editText, setEditText] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const editMode = useEditMode()
  useEffect(() => setInputValue(title), [title])
  return <>
    {!editMode &&
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
    }
    {editMode && !editText &&
    <Pressable style={styles.container} onPress={() => setEditText(true)}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
    }
    {editMode && editText &&
    <View style={styles.container}>
      <TextInput
        style={[styles.title, styles.titleEdit]}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Pressable
        style={styles.button}
        onPress={() => setEditText(false)}
      >
        <X size={20} />
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!inputValue) return
          onChange(inputValue)
          setEditText(false)
        }}
      >
        <Check size={20} />
      </Pressable>
    </View>
    }
  </>
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    padding: 10,
    color: 'lightgrey',
    userSelect: 'none',
  },
  titleEdit: {
    color: 'black',
    borderWidth: 1,
    borderRadius: 10,
    minWidth: 0
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
    gap: 10,
    paddingHorizontal: 10,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  }
})