import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { EditTile } from "../[board]";
import { usePagesetActions } from "../stores/boards";
import { handleError } from "../utils/error";
import { selectImage } from "../utils/file";
import { BoardButton, TileImage } from "../utils/types";
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
  return (
    <View style={{ flexDirection: 'row' }}>
      <Pressable
        style={{
          ...styles.tabButton,
          ...(tab === 'settings' ? styles.tabButtonActive : {}),
        }}
        onPress={() => setTab('settings')}
      >
        <Text 
          style={{
            ...styles.tabButtonText,
            ...(tab === 'settings' ? styles.tabButtonTextActive : {}),
          }}
        >Settings</Text>
      </Pressable>
      <Pressable
        style={{
          ...styles.tabButton,
          ...(tab === 'symbol' ? styles.tabButtonActive : {}),
        }}
        onPress={() => setTab('symbol')}
      >
        <Text 
          style={{
            ...styles.tabButtonText,
            ...(tab === 'symbol' ? styles.tabButtonTextActive : {}),
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
  pageNames: { id: string, name: string }[];
}) {
  const { setSymbolSearchText } = usePagesetActions()
  const button = tile?.button
  const image = tile?.image
  const setButton = (newButton: BoardButton | undefined, newImage: TileImage | undefined) => tile && setTile({
    button: newButton,
    image: newImage,
    index: tile.index,
  })
  const [tab, setTab] = useState<Tab>('settings')

  const deleteTile = () => {
    setButton(undefined, undefined)
    ref.current?.dismiss()
  }

  const onUpload = async () => {
    if (!button) return
    try {
      const image = await selectImage()
      setButton(button, image)
    } catch (e) {
      handleError(e)
    }
  }

  return (
    <TrueSheet
      ref={ref}
      detents={Platform.OS === "web" ? [0.75] : [0.5, 0.75]}
      onWillDismiss={onClose}
      backgroundColor="white"
      scrollable
      footer={tab === "symbol" ? <SymbolSearchBar onUpload={onUpload} /> : undefined}
    >
      {button &&
      <View style={{ flex: 1}}>
        <View style={{
          ...styles.labelContainer,
          padding: 20,
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
            }}
          />
          <Pressable onPress={() => ref.current?.dismiss()}>
            <Check size={30} />
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
    gap: 10
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    fontSize: 18,
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    color: 'grey',
  },
  label: {
    fontSize: 16,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  tabButtonText: {
    fontSize: 16,
    color: 'grey',
  },
  tabButtonTextActive: {
    color: 'black',
  }
})