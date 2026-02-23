import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Search, Upload } from "lucide-react-native";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePagesetActions, useSymbolSearchText } from "../stores/boards";
import { searchSymbols } from "../utils/symbols";
import { TileImage } from "../utils/types";

const searchBarHeight = 50
const isIPad = Platform.OS === 'ios' && Platform.isPad;

export const SymbolSearchBar = ({
  onUpload,
}: {
  onUpload: () => void;
}) => {
  const insets = useSafeAreaInsets()
  const bottomInset = isIPad ? 0 : insets.bottom
  const symbolSearchText = useSymbolSearchText()
  const { setSymbolSearchText } = usePagesetActions()
  return <View style={{
    ...styles.searchBarContainer,
    paddingBottom: bottomInset,
  }}>
    <View style={styles.searchBar}>
      <Search size={20} style={styles.inputIcon} />
      <TextInput
        value={symbolSearchText}
        onChangeText={setSymbolSearchText}
        style={{
          ...styles.input,
          paddingLeft: 40,
        }}
      />
    </View>
    <Pressable
      style={styles.uploadButton}
      onPress={onUpload}
    >
      <Upload size={20} />
      <Text>Upload</Text>
    </Pressable>
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
              style={symbol && s.url === symbol.url ? styles.selectedSymbol : undefined}
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
        <ActivityIndicator style={styles.symbolAlert} size="large" />
      }
      {data && data.length === 0 &&
        <Text style={styles.symbolAlert}>No search results</Text>
      }
    </ScrollView>)
}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingLeft: 40,
    paddingVertical: 10,
    fontSize: 18,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    color: 'grey',
  },
  symbol: {
    width: 100,
    height: 100,
  },
  symbolAlert: {
    marginTop: 20,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopColor: 'grey',
    borderTopWidth: 1,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: searchBarHeight,
    backgroundColor: 'white',
  },
  symbolContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 20,
    padding: 20,
    justifyContent: 'center'
  },
  selectedSymbol: {
    outlineWidth: 2,
    outlineColor: "white",
    outlineStyle: "solid",
    zIndex: 1,
    boxShadow: "1px 1px 10px black",
  },
  uploadButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
  }
})