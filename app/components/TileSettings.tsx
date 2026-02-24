import { AACSemanticCategory, AACSemanticIntent } from "@willwade/aac-processors/browser";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { FONT_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
import { BoardButton } from "../utils/types";
import ColorPicker from "./ColorPicker";
import SheetPicker from "./SheetPicker";
import { Text } from "./Styled";
import TileDelete from "./TileDelete";

type PageName = {
  value: string | undefined;
  label: string
}

export default function TileSettings ({
  button,
  setButton,
  pageNames,
  deleteTile,
}: {
  button: BoardButton;
  setButton: (button: BoardButton) => void;
  pageNames: PageName[];
  deleteTile: () => void;
}) {
  const theme = useTheme()

  const setVocalization = (message: string) => {
    setButton({
      ...button,
      message,
      semanticAction: button.semanticAction
        ? {...button.semanticAction, text: message}
        : undefined
    })
  }
  const setNavigation = (item: PageName) => {
    if (item.value === undefined) {
      setButton({
        ...button,
        semanticAction: {
          category: AACSemanticCategory.COMMUNICATION,
          intent: AACSemanticIntent.SPEAK_TEXT,
          text: button.message,
        }
      })
    } else {
      setButton({
        ...button,
        semanticAction: {
          category: AACSemanticCategory.NAVIGATION,
          intent: AACSemanticIntent.NAVIGATE_TO,
          targetId: item.value,
          fallback: {
              type: 'NAVIGATE',
              targetPageId: item.value,
          },
        }
      })
    }
  }
  return (
    <ScrollView
      nestedScrollEnabled
      contentContainerStyle={{display: 'flex', gap: 20, padding: 20}}
    >
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Vocalization</Text>
        <TextInput
          value={button.message}
          onChangeText={setVocalization}
          placeholder={button.label}
          style={{
            ...styles.input,
            borderColor: theme.outline,
            color: theme.onSurface,
          }}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Navigate</Text>
        <SheetPicker
          items={[
            {value: undefined, label: '(none)'},
            ...pageNames
          ]}
          value={button.semanticAction?.targetId}
          onChange={setNavigation}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Background</Text>
        <ColorPicker
          color={button.style?.backgroundColor}
          onChange={(backgroundColor) => setButton({
            ...button,
            style: {
              ...button.style,
              backgroundColor
            }
          })}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Border</Text>
        <ColorPicker
          color={button.style?.borderColor}
          onChange={(borderColor) => setButton({
            ...button,
            style: {
              ...button.style,
              borderColor
            }
          })}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Text</Text>
        <ColorPicker
          color={button.style?.fontColor}
          onChange={(fontColor) => setButton({
            ...button,
            style: {
              ...button.style,
              fontColor
            }
          })}
        />
      </View>
      <TileDelete onPress={deleteTile} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: PADDING.lg,
    paddingLeft: PADDING.lg,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderRadius: RADIUS.md,
  },
})