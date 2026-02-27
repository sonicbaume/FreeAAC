import { Modal, StyleSheet, View } from "react-native";
import { FONT_SIZE, GAP, MAX_WIDTH, PADDING, RADIUS, useTheme } from "../utils/theme";
import { Button, Text } from "./Styled";

export default function DialogConfirm ({
  onConfirm,
  onCancel,
  visible,
  message = "Are you sure you want to delete?",
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
}: {
  onConfirm: () => void;
  onCancel: () => void;
  visible: boolean;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}) {
  const theme = useTheme()
  return (
    <Modal
     visible={visible}
     onRequestClose={onCancel}
     transparent
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{...styles.modal, backgroundColor: theme.surfaceContainer }}>
          <Text style={{ fontSize: FONT_SIZE.md, textAlign: 'center', paddingVertical: PADDING.lg }}>{message}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: GAP.lg }}>
            <Button variant="outline" onPress={onCancel} style={{ flex: 1 }}>
              <Text>{cancelLabel}</Text>
            </Button>
            <Button variant="destructive" onPress={onConfirm} style={{ flex: 1 }}>
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
    display: 'flex',
    width: '90%',
    maxWidth: MAX_WIDTH,
    margin: 'auto',
    padding: PADDING.xxl,
    borderRadius: RADIUS.lg,
    gap: GAP.lg,
  }
})