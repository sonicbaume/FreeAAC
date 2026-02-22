import { AACSemanticCategory, AACSemanticIntent } from "@willwade/aac-processors/browser";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { BoardButton } from "../utils/types";
import ColorPicker from "./ColorPicker";

type PageName = {
  id: string | undefined;
  name: string
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
    if (item.id === undefined) {
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
          targetId: item.id,
          fallback: {
              type: 'NAVIGATE',
              targetPageId: item.id,
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
          style={styles.input}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: 'right' }}>Navigate</Text>
        <Dropdown
          data={[
            {id: undefined, name: '(none)'},
            ...pageNames
          ]}
          labelField="name"
          valueField="id"
          value={button.semanticAction?.targetId}
          onChange={setNavigation}
          style={{
            ...styles.input,
            minWidth: 200,
          }}
        />
      </View>
      <ColorPicker
      label="Background"
        color={button.style?.backgroundColor}
        onChange={(backgroundColor) => setButton({
          ...button,
          style: {
            ...button.style,
            backgroundColor
          }
        })}
      />
      <ColorPicker
        label="Border"
        color={button.style?.borderColor}
        onChange={(borderColor) => setButton({
          ...button,
          style: {
            ...button.style,
            borderColor
          }
        })}
      />
      <ColorPicker
        label="Text"
        color={button.style?.fontColor}
        onChange={(fontColor) => setButton({
          ...button,
          style: {
            ...button.style,
            fontColor
          }
        })}
      />
      <Pressable
        style={styles.deleteButton}
        onPress={deleteTile}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10
  },
  deleteButtonText: {
    color: 'red'
  }
})