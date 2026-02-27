import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { useEditMode } from "../stores/boards";
import { FONT_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
import DialogRename from "./DialogRename";
import { Text } from "./Styled";

export default function PageTitle({
  title,
  onChange,
}: {
  title: string | undefined,
  onChange: (title: string | undefined) => void;
}) {
  const theme = useTheme()
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const editMode = useEditMode()
  return <>
    <Pressable
      style={{
        ...styles.container,
        backgroundColor: theme.surfaceContainer,
      }}
      onPress={() => setShowRenameDialog(true)}
      disabled={!editMode}
    >
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
    </Pressable>
    {editMode &&
    <DialogRename
      initialText={title}
      visible={showRenameDialog}
      onCancel={() => setShowRenameDialog(false)}
      onConfirm={(name: string | undefined) => {
        onChange(name)
        setShowRenameDialog(false)
      }}
    />}
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