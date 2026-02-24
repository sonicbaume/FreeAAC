import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { ChevronsUpDown } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { GAP, ICON_SIZE, PADDING, RADIUS, useTheme } from "../utils/theme";
import SheetItem from "./SheetItem";
import { Text } from "./Styled";

type Item = {
  value: string | undefined;
  label: string;
};

export default function SheetPicker({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string | undefined;
  onChange: (item: Item) => void;
}) {
  const theme = useTheme()
  const ref = useRef<TrueSheet>(null)
  const shouldScroll = items.length > 10
  return <>
    <Pressable
      style={{
        ...styles.selector,
        backgroundColor: theme.surfaceContainer
      }}
      onPress={() => ref.current?.present()}
    >
      <Text style={{ color: theme.onSurface }}>
        {items.find(i => i.value === value)?.label ?? ''}
      </Text>
      <ChevronsUpDown size={ICON_SIZE.md} color={theme.onSurface} />
    </Pressable>
    <TrueSheet
      ref={ref}
      detents={shouldScroll ? [0.75] : ['auto']}
      backgroundColor={theme.surfaceContainer}
      style={{ padding: PADDING.xl }}
      scrollable={shouldScroll}
    >
      <ScrollView nestedScrollEnabled>
      {items.map(item =>
        <SheetItem
          label={item.label}
          onPress={() => {
            onChange(item)
            ref.current?.dismiss()
          }}
        />)}
      </ScrollView>
    </TrueSheet>
  </>
}

const styles = StyleSheet.create({
  selector: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.xs,
    padding: PADDING.lg,
    borderRadius: RADIUS.lg,
  }
})