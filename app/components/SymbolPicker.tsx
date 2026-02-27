import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Camera, Search, Upload } from "lucide-react-native";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePagesetActions, useSymbolSearchText } from "../stores/boards";
import { searchSymbols } from "../utils/symbols";
import { FONT_SIZE, GAP, ICON_SIZE, PADDING, useTheme } from "../utils/theme";
import { TileImage } from "../utils/types";
import { Button, Text } from "./Styled";

const searchBarHeight = 50
const isIPad = Platform.OS === 'ios' && Platform.isPad;

export const SymbolSearchBar = ({
  onSelectImage,
  onTakePhoto,
}: {
  onSelectImage: () => void;
  onTakePhoto: () => void;
}) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const bottomInset = isIPad ? 0 : insets.bottom
  const symbolSearchText = useSymbolSearchText()
  const { setSymbolSearchText } = usePagesetActions()
  return <View style={{
    ...styles.searchBarContainer,
    paddingBottom: bottomInset,
    backgroundColor: theme.surface,
    borderTopColor: theme.outline,
  }}>
    <View style={{...styles.searchBar, backgroundColor: theme.surface}}>
      <Search size={ICON_SIZE.md} style={styles.inputIcon} color={theme.onSurface} />
      <TextInput
        value={symbolSearchText}
        onChangeText={setSymbolSearchText}
        style={{
          ...styles.input,
          paddingLeft: 40,
          color: theme.onSurface,
        }}
      />
    </View>
    <Button
      variant="primary"
      onPress={onTakePhoto}
      style={{ margin: PADDING.sm }}
    >
      <Camera size={ICON_SIZE.lg} color={theme.onPrimary} />
    </Button>
    <Button
      variant="primary"
      onPress={onSelectImage}
      style={{ margin: PADDING.sm }}
    >
      <Upload size={ICON_SIZE.lg} color={theme.onPrimary} />
    </Button>
  </View>
}

export default function SymbolPicker({
  onSelect,
  symbol,
}: {
  label: string;
  symbol: TileImage | undefined;
  onSelect: (symbol: TileImage) => void;
}) {
  const theme = useTheme()
  const searchText = useSymbolSearchText()
  const { isPending, error, data } = useQuery({
    queryKey: ['symbols', searchText],
    queryFn: () => searchSymbols(searchText),
  })
  const insets = useSafeAreaInsets()
  const bottomInset = isIPad ? 0 : insets.bottom
  const symbols = (
    data && symbol ? [symbol, ...data.filter(image => image.url !== symbol.url)]
      : data ? data
        : symbol ? [symbol]
          : []
  )
  return (
    <ScrollView
      nestedScrollEnabled
      style={{ marginBottom: bottomInset + 50 }}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      {error &&
        <Text style={styles.symbolAlert}>Error: {String(error)}</Text>
      }
      {symbols && symbols.length > 0 &&
        <View style={styles.symbolContainer}>
          {symbols.map((s, index) => (
            <Pressable
              key={index}
              onPress={() => onSelect(s)}
              style={
                symbol && s.url === symbol.url
                ? {...styles.selectedSymbol, outlineColor: theme.onSurface}
                : undefined
              }
            >
              <Image
                source={s.url}
                style={styles.symbol}
                cachePolicy="memory"
              />
            </Pressable>
          ))}
        </View>
      }
      {isPending &&
        <ActivityIndicator style={styles.symbolAlert} size="large" color={theme.onSurface} />
      }
      {data && data.length === 0 &&
        <Text style={styles.symbolAlert}>No search results</Text>
      }
    </ScrollView>)
}

const styles = StyleSheet.create({
  header: {
    fontSize: FONT_SIZE.md,
    marginBottom: PADDING.lg,
  },
  symbol: {
    width: 100,
    height: 100,
  },
  symbolAlert: {
    marginTop: PADDING.xxl,
  },
  symbolContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: GAP.xl,
    padding: PADDING.xl,
    justifyContent: 'center'
  },
  selectedSymbol: {
    outlineWidth: 2,
    outlineStyle: "solid",
    zIndex: 1,
    boxShadow: "1px 1px 10px black",
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: GAP.lg,
    height: searchBarHeight,
  },
  input: {
    flex: 1,
    paddingLeft: GAP.lg + PADDING.xxl,
    paddingVertical: PADDING.lg,
    fontSize: FONT_SIZE.lg,
  },
  inputIcon: {
    position: 'absolute',
    left: GAP.lg,
  },
})
