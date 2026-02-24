import { Check, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useEditMode } from "../stores/boards";
import { FONT_SIZE, ICON_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
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

  return <>
    {!editMode &&
    <View style={{
      ...styles.container,
      backgroundColor: theme.surfaceContainer,
    }}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </View>
    }
    {editMode && !editText &&
    <Pressable
      style={{...styles.container, backgroundColor: theme.surfaceContainer}}
      onPress={() => setEditText(true)}
    >
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </Pressable>
    }
    {editMode && editText &&
    <View style={{...styles.container, backgroundColor: theme.surfaceContainer}}>
      <TextInput
        style={{
          ...styles.title,
          ...styles.titleEdit,
          color: theme.onSurface,
          borderColor: theme.outline
        }}
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button variant="ghost" onPress={() => setEditText(false)}>
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

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZE.xl,
    padding: PADDING.lg,
    userSelect: 'none',
    textOverflow: 'ellipsis',
  },
  titleEdit: {
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    minWidth: 0
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDING.lg,
  },
})