import { useBoards } from "@/stores/boards"
import {
  AACSemanticCategory,
  AACSemanticIntent,
} from "@willwade/aac-processors/browser"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react-native"
import { ScrollView, StyleSheet, TextInput, View } from "react-native"
import { ButtonVisibility, buttonVisibilityValues } from "../../utils/consts"
import {
  FONT_SIZE,
  GAP,
  ICON_SIZE,
  PADDING,
  RADIUS,
  useTheme,
} from "../../utils/theme"
import { BoardButton } from "../../utils/types"
import ColorPicker from "../ColorPicker"
import SheetPicker from "../SheetPicker"
import { Button, Text } from "../Styled"
import TileDelete from "./TileDelete"

type PageOption = { value: string | undefined; label: string }

export default function TileSettings({
  boardId,
  button,
  setButton,
  deleteTile,
  index,
  originalIndex,
  setIndex,
  grid,
  rows,
  cols,
}: {
  boardId: string | string[]
  button: BoardButton
  setButton: (button: BoardButton) => void
  deleteTile: () => void
  index: number
  originalIndex: number
  setIndex: (index: number) => void
  grid: (BoardButton | null)[]
  rows: number
  cols: number
}) {
  const theme = useTheme()
  const boards = useBoards()
  const pages = boards.find((b) => b.id === boardId)?.pages ?? []
  const pagePaths = pages.map((p): PageOption => {
    return { value: p.path, label: p.name }
  })
  const row = Math.floor(index / cols)
  const col = index - row * cols
  const rowItems = Array.from({ length: rows }, (_, r) => ({
    value: String(r),
    label: `Row ${r + 1}`,
  }))
  const colItems = Array.from({ length: cols }, (_, c) => ({
    value: String(c),
    label: `Col ${c + 1}`,
  }))
  const canMoveUp = row > 0
  const canMoveDown = row < rows - 1
  const canMoveLeft = col > 0
  const canMoveRight = col < cols - 1
  const targetTile = index !== originalIndex ? grid[index] : undefined

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
          onChange={({ value }) =>
            setButton({
              ...button,
              visibility: value as ButtonVisibility,
            })
          }
        />
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            minWidth: 100,
            textAlign: "right",
            paddingTop: PADDING.lg,
          }}
        >
          Position
        </Text>
        <View style={{ flex: 1, gap: GAP.md }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: GAP.md,
              alignItems: "center",
            }}
          >
            <SheetPicker
              items={rowItems}
              value={String(row)}
              onChange={(item) => {
                if (item.value !== undefined)
                  setIndex(Number(item.value) * cols + col)
              }}
            />
            <SheetPicker
              items={colItems}
              value={String(col)}
              onChange={(item) => {
                if (item.value !== undefined)
                  setIndex(row * cols + Number(item.value))
              }}
            />
            <View style={{ flexDirection: "row", gap: GAP.xs }}>
              <Button
                variant="outline"
                disabled={!canMoveUp}
                accessibilityRole="button"
                accessibilityLabel="Move tile up"
                style={{ opacity: canMoveUp ? 1 : 0.4 }}
                onPress={() => setIndex((row - 1) * cols + col)}
              >
                <ArrowUp size={ICON_SIZE.md} color={theme.onSurface} />
              </Button>
              <Button
                variant="outline"
                disabled={!canMoveDown}
                accessibilityRole="button"
                accessibilityLabel="Move tile down"
                style={{ opacity: canMoveDown ? 1 : 0.4 }}
                onPress={() => setIndex((row + 1) * cols + col)}
              >
                <ArrowDown size={ICON_SIZE.md} color={theme.onSurface} />
              </Button>
              <Button
                variant="outline"
                disabled={!canMoveLeft}
                accessibilityRole="button"
                accessibilityLabel="Move tile left"
                style={{ opacity: canMoveLeft ? 1 : 0.4 }}
                onPress={() => setIndex(row * cols + (col - 1))}
              >
                <ArrowLeft size={ICON_SIZE.md} color={theme.onSurface} />
              </Button>
              <Button
                variant="outline"
                disabled={!canMoveRight}
                accessibilityRole="button"
                accessibilityLabel="Move tile right"
                style={{ opacity: canMoveRight ? 1 : 0.4 }}
                onPress={() => setIndex(row * cols + (col + 1))}
              >
                <ArrowRight size={ICON_SIZE.md} color={theme.onSurface} />
              </Button>
            </View>
          </View>
          {index !== originalIndex && (
            <Text style={{ fontSize: FONT_SIZE.sm, color: theme.outline }}>
              {targetTile ?
                `Swaps with "${targetTile.label}"`
              : "Moves to empty slot"}
            </Text>
          )}
        </View>
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
