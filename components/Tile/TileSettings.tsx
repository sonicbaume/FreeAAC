import { useBoards } from "@/stores/boards"
import {
  AACSemanticCategory,
  AACSemanticIntent,
} from "@willwade/aac-processors/browser"
import { ScrollView, StyleSheet, TextInput, View } from "react-native"
import { ButtonVisibility, buttonVisibilityValues } from "../../utils/consts"
import { FONT_SIZE, PADDING, RADIUS, useTheme } from "../../utils/theme"
import { BoardButton } from "../../utils/types"
import ColorPicker from "../ColorPicker"
import SheetPicker from "../SheetPicker"
import { Text } from "../Styled"
import TileDelete from "./TileDelete"

type PageOption = { value: string | undefined; label: string }

export default function TileSettings({
  boardId,
  button,
  setButton,
  deleteTile,
}: {
  boardId: string | string[]
  button: BoardButton
  setButton: (button: BoardButton) => void
  deleteTile: () => void
}) {
  const theme = useTheme()
  const boards = useBoards()
  const pages = boards.find((b) => b.id === boardId)?.pages ?? []
  const pagePaths = pages.map((p): PageOption => {
    return { value: p.path, label: p.name }
  })

  const setVocalization = (message: string) => {
    setButton({
      ...button,
      message,
      semanticAction:
        button.semanticAction ?
          { ...button.semanticAction, text: message }
        : undefined,
    })
  }
  const setNavigation = (item: PageOption) => {
    if (item.value === undefined) {
      setButton({
        ...button,
        semanticAction: {
          category: AACSemanticCategory.COMMUNICATION,
          intent: AACSemanticIntent.SPEAK_TEXT,
          text: button.message,
        },
      })
    } else {
      setButton({
        ...button,
        semanticAction: {
          category: AACSemanticCategory.NAVIGATION,
          intent: AACSemanticIntent.NAVIGATE_TO,
          targetId: item.value,
          fallback: {
            type: "NAVIGATE",
            targetPageId: item.value,
          },
        },
        targetPageId: item.value,
      })
    }
  }
  return (
    <ScrollView
      nestedScrollEnabled
      contentContainerStyle={{ display: "flex", gap: 20, padding: 20 }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Vocalization
        </Text>
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Navigate
        </Text>
        <SheetPicker
          items={[{ value: undefined, label: "(none)" }, ...pagePaths]}
          value={button.semanticAction?.targetId}
          onChange={setNavigation}
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Background
        </Text>
        <ColorPicker
          color={button.style?.backgroundColor}
          onChange={(backgroundColor) =>
            setButton({
              ...button,
              style: {
                ...button.style,
                backgroundColor,
              },
            })
          }
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Border
        </Text>
        <ColorPicker
          color={button.style?.borderColor}
          onChange={(borderColor) =>
            setButton({
              ...button,
              style: {
                ...button.style,
                borderColor,
              },
            })
          }
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Text
        </Text>
        <ColorPicker
          color={button.style?.fontColor}
          onChange={(fontColor) =>
            setButton({
              ...button,
              style: {
                ...button.style,
                fontColor,
              },
            })
          }
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, minWidth: 100, textAlign: "right" }}>
          Visibility
        </Text>
        <SheetPicker
          items={buttonVisibilityValues}
          value={button.visibility ?? "Visible"}
          onChange={({ value, label }) =>
            setButton({
              ...button,
              visibility: value as ButtonVisibility,
            })
          }
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
