import { Check, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useEditMode } from "../stores/boards";
import { FONT_SIZE, GAP, ICON_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function PageTitle({
  title,
  onChange,
}: {
  title: string | undefined,
  onChange: (title: string) => void;
}) {
  const theme = useTheme()
  const [editText, setEditText] = useState(false)
  const [inputValue, setInputValue] = useState(title)
  const editMode = useEditMode()
  useEffect(() => setInputValue(title), [title])

  const styles = StyleSheet.create({
    title: {
      fontSize: FONT_SIZE.xl,
      padding: PADDING.lg,
      color: theme.onSurface,
      userSelect: 'none',
    },
    titleEdit: {
      color: theme.onSurface,
      borderWidth: 1,
      borderColor: theme.outline,
      borderRadius: RADIUS.lg,
      minWidth: 0
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceContainer,
      gap: GAP.md,
      paddingHorizontal: PADDING.lg,
    },
  })

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
      <Button variant="outline" onPress={() => setEditText(false)}>
        <X size={ICON_SIZE.lg} color={theme.onSurface} />
      </Button>
      <Button variant="primary" onPress={() => {
          if (!inputValue) return
          onChange(inputValue)
          setEditText(false)
        }}
      >
        <Check size={ICON_SIZE.lg} color={theme.onPrimary} />
      </Button>
    </View>
    }
  </>
}
