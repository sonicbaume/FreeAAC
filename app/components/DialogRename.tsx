import { useEffect, useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { FONT_SIZE, GAP, MAX_WIDTH, PADDING, RADIUS, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function DialogRename ({
  initialText,
  onConfirm,
  onCancel,
  visible,
  message = "Please enter a new name",
  cancelLabel = "Cancel",
  confirmLabel = "Rename",
}: {
  initialText?: string;
  onConfirm: (name: string | undefined) => void;
  onCancel: () => void;
  visible: boolean;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  const theme = useTheme()
  const [text, setText] = useState(initialText)
  useEffect(() => setText(initialText), [initialText, visible])
  const cancel = () => {
    setText(initialText)
    onCancel()
  }
  return (
    <Modal
     visible={visible}
     onRequestClose={cancel}
     transparent
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{...styles.modal, backgroundColor: theme.surfaceContainer }}>
          <Text style={{ fontSize: FONT_SIZE.md, textAlign: 'center' }}>{message}</Text>
          <TextInput
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.outline,
              borderRadius: RADIUS.md,
              borderWidth: 1,
              padding: PADDING.lg,
              color: theme.onSurface
            }}
            value={text}
            onChangeText={setText}
          />
          <View style={{ display: 'flex', flexDirection: 'row', gap: GAP.lg }}>
            <Button variant="outline" onPress={cancel} style={{ flex: 1 }}>
              <Text>{cancelLabel}</Text>
            </Button>
            <Button variant="destructive" onPress={() => onConfirm(text)} style={{ flex: 1 }}>
              <Text style={{ color: theme.onError}}>{confirmLabel}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    width: '90%',
    maxWidth: MAX_WIDTH,
    margin: 'auto',
    padding: PADDING.xxl,
    borderRadius: RADIUS.lg,
    gap: GAP.lg,
  }
})