import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { EditTile } from "../[board]";
import { usePagesetActions } from "../stores/boards";
import { handleError } from "../utils/error";
import { selectImage } from "../utils/file";
import { FONT_SIZE, GAP, ICON_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
import { BoardButton, TileImage } from "../utils/types";
import { Text } from "./Styled";
import SymbolPicker, { SymbolSearchBar } from "./SymbolPicker";
import TileSettings from "./TileSettings";

const tabs = ['settings', 'symbol'] as const
type Tab = typeof tabs[number]

const TabSelector = ({
  tab,
  setTab
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) => {
  const theme = useTheme()
  return (
    <View style={{ flexDirection: 'row', backgroundColor: theme.surfaceContainer }}>
      <Pressable
        style={{
          ...styles.tabButton,
          borderBottomColor: tab === 'settings' ? theme.onSurface : theme.outline,
          borderBottomWidth: tab === 'settings' ? 2 : 1
        }}
        onPress={() => setTab('settings')}
      >
        <Text 
          style={{
            ...styles.tabButtonText,
            color: tab === 'settings' ? theme.onSurface : theme.outline
          }}
        >Settings</Text>
      </Pressable>
      <Pressable
        style={{
          ...styles.tabButton,
          borderBottomColor: tab === 'symbol' ? theme.onSurface : theme.outline,
          borderBottomWidth: tab === 'symbol' ? 2 : 1
        }}
        onPress={() => setTab('symbol')}
      >
        <Text 
          style={{
            ...styles.tabButtonText,
            color: tab === 'symbol' ? theme.onSurface : theme.outline
          }}
        >
          Symbol
        </Text>
      </Pressable>
    </View>
  )
}

export default function TileEditor({
  ref,
  tile,
  setTile,
  onClose,
  pageNames,
}: {
  ref: React.RefObject<TrueSheet | null>;
  tile: EditTile | undefined;
  setTile: (tile: EditTile) => void;
  onClose: () => void;
  pageNames: { value: string, label: string }[];
}) {
  const theme = useTheme()
  const { setSymbolSearchText } = usePagesetActions()
  const button = tile?.button
  const image = tile?.image
  const setButton = (
    newButton: BoardButton | undefined,
    newImage: TileImage | undefined
  ) => {
    tile && setTile({
      button: newButton,
      image: newImage,
      index: tile.index,
    })
  }
  const [tab, setTab] = useState<Tab>('settings')

  const deleteTile = () => {
    setButton(undefined, undefined)
    ref.current?.dismiss()
  }

  const onSelectImage = async (takePhoto: boolean) => {
    if (!button) return
    try {
      const image = await selectImage(takePhoto)
      if (image) setButton(button, image)
    } catch (e) {
      handleError(e)
    }
  }

  return (
    <TrueSheet
      ref={ref}
      detents={Platform.OS === "web" ? [0.75] : [0.5, 0.75]}
      onWillDismiss={onClose}
      backgroundColor={theme.surface}
      scrollable
      footer={tab === "symbol"
        ? <SymbolSearchBar
            onSelectImage={() => onSelectImage(false)}
            onTakePhoto={() => onSelectImage(true)}
          />
        : undefined}
    >
      {button &&
      <View style={{ flex: 1 }}>
        <View style={{
          ...styles.labelContainer,
          padding: PADDING.xl,
          backgroundColor: theme.surfaceContainer
        }}>
          <TextInput
            value={button?.label}
            onChangeText={label => {
              if (!button) return
              setButton({
                ...button,
                label,
                message: label,
                semanticAction: button.semanticAction
                  ? {...button.semanticAction, text: label}
                  : undefined}
              , image)
              setSymbolSearchText(label)
            }}
            style={{
              ...styles.input,
              ...styles.inputBorder,
              backgroundColor: theme.surface,
              color: theme.onSurface,
              borderColor: theme.outline
            }}
          />
          <Pressable onPress={() => ref.current?.dismiss()}>
            <Check size={ICON_SIZE.xl} color={theme.onSurface} />
          </Pressable>
        </View>
        <TabSelector tab={tab} setTab={setTab} />
        {tab === 'settings' &&
        <TileSettings
          button={button}
          setButton={newButton => setButton(newButton, image)}
          pageNames={pageNames}
          deleteTile={deleteTile}
        />}
        {tab === 'symbol' &&
        <SymbolPicker
          label={button.label}
          symbol={image}
          onSelect={(image) => setButton({...button}, image)}
        />}
      </View>
      }
    </TrueSheet>
  )
}

const styles = StyleSheet.create({
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.lg
  },
  input: {
    flex: 1,
    paddingVertical: PADDING.lg,
    paddingLeft: PADDING.lg,
    fontSize: FONT_SIZE.lg,
  },
  inputBorder: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  tabButtonText: {
    fontSize: FONT_SIZE.md,
    color: 'grey',
  },
})