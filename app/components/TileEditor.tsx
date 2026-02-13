import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { EditTile } from "../[board]";
import { BoardButton } from "../utils/types";
import ColorPicker from "./ColorPicker";
import SymbolPicker, { SymbolSearchBar } from "./SymbolPicker";

export default function TileEditor({
  ref,
  tile,
  setTile,
  onClose,
}: {
  ref: React.RefObject<TrueSheet | null>;
  tile: EditTile | undefined;
  setTile: (tile: EditTile) => void;
  onClose: () => void;
}) {
  const button = tile?.button
  const setButton = (newButton: BoardButton) => tile && setTile({
    button: newButton,
    index: tile.index,
  })
  const [tab, setTab] = useState<'details' | 'symbol'>('details')
  return (
    <TrueSheet
      ref={ref}
      detents={[0.5, 0.75, 1]}
      onWillDismiss={onClose}
      backgroundColor="white"
      scrollable
      footer={tab === "symbol" ? <SymbolSearchBar /> : undefined}
    >
      {button &&
      <View style={{ }}>
        <View style={{
          ...styles.labelContainer,
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: 'grey',
        }}>
          <TextInput
            value={button?.label}
            onChangeText={label => button && setButton({...button, label})}
            style={{
              ...styles.input,
              ...styles.inputBorder,
            }}
          />
          <Pressable onPress={() => ref.current?.dismiss()}>
            <Check size={30} />
          </Pressable>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Pressable style={styles.tabButton} onPress={() => setTab('details')}>
            <Text style={{ fontSize: 16 }}>Details</Text>
          </Pressable>
          <Pressable style={styles.tabButton} onPress={() => setTab('symbol')}>
            <Text style={{ fontSize: 16 }}>Symbol</Text>
          </Pressable>
        </View>
        {tab === 'details' && <>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            value={button.message}
            style={styles.input}
          />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Background</Text>
          <ColorPicker
            color={button.style?.backgroundColor}
            onChange={(backgroundColor) => setButton({
              ...button,
              style: {
                ...button.style,
                backgroundColor
              }
            })} />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Border</Text>
          <ColorPicker
            color={button.style?.borderColor}
            onChange={(borderColor) => setButton({
              ...button,
              style: {
                ...button.style,
                borderColor
              }
            })} />
        </View>
        <View style={{
          ...styles.labelContainer,
          marginBottom: 20,
        }}>
          <Text style={styles.label}>Text</Text>
          <ColorPicker
            color={button.style?.fontColor}
            onChange={(fontColor) => setButton({
              ...button,
              style: {
                ...button.style,
                fontColor
              }
            })} />
        </View>
        </>}
        {tab === 'symbol' &&
        <SymbolPicker
          label={button.label}
          symbolUrl={button.image}
          onSelect={(image) => setButton({...button, image})}
        />
        }
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
    gap: 10,
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
    width: '20%',
    minWidth: 100,
    textAlign: 'right',
  },
  tabButton: {
    flex: 1, justifyContent: 'center', alignItems: 'center', height: 40, borderWidth: 2
  }
})