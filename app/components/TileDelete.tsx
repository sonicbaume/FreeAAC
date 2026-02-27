import { useState } from "react";
import { useTheme } from "../utils/theme";
import DialogConfirm from "./DialogConfirm";
import { Button, Text } from "./Styled";

export default function TileDelete ({
  onPress
}: {
  onPress: () => void;
}) {
  const theme = useTheme()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  return <>
    <Button
      variant="destructive"
      onPress={() => setShowConfirmDialog(true)}
    >
      <Text style={{ color: theme.onError }}>Delete</Text>
    </Button>
    {showConfirmDialog &&
    <DialogConfirm
      visible={showConfirmDialog}
      onCancel={() => setShowConfirmDialog(false)}
      onConfirm={() => {
        onPress()
        setShowConfirmDialog(false)
      }}
    />
    }
  </>
}