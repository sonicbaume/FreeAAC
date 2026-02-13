import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Search } from "lucide-react-native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { usePagesetActions, useSymbolSearchText } from "../stores/boards";
import { searchSymbols } from "../utils/symbols";

export const SymbolSearchBar = () => {
  const symbolSearchText = useSymbolSearchText()
  const { setSymbolSearchText } = usePagesetActions()
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: 'grey' }}>
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
  )
}

export default function SymbolPicker({
  label,
  symbolUrl,
  onSelect,
}: {
  label: string;
  symbolUrl: string | undefined;
  onSelect: (url: string) => void;
}) {
  const searchText = useSymbolSearchText()
  const { isPending, error, data } = useQuery({
    queryKey: ['symbols', searchText],
    queryFn: () => searchSymbols(searchText),
  })
  return <View style={{  }}>
    {/* <Text style={styles.header}>Symbol</Text> */}
    {/* <Image
      source={symbolUrl}
      style={{
        width: 200,
        height: 200,
        marginHorizontal: 'auto'
      }}
    /> */}
    {/* <ScrollView
      nestedScrollEnabled
      style={{ flex: 1, borderWidth: 2, borderColor: 'blue' }}
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingBottom: 20,
        borderWidth: 2
      }}  
    > */}
      {isPending && <Text>Loading...</Text>}
      {error && <Text>Error: {String(error)}</Text>}
      {data && data.length === 0 && <Text>No symbols found</Text>}
      {data && data.length > 0 &&
      <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: 20, padding: 20, justifyContent: 'center' }}>
        {data.map((url, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(url)}
        >
          <Image
            source={url}
            style={styles.symbol}
            cachePolicy="memory"
          />
        </Pressable>
      ))}
      </View>
      }
    {/* </ScrollView> */}
    {/* <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 2, borderColor: 'red', height: 50 }}>
      <Search size={20} style={styles.inputIcon} />
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
    </View> */}
  </View>
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
  symbolContainer: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // gap: 10,
    // paddingTop: 10,
    height: 200,
    borderWidth: 2,
    borderColor: 'red',
  }
})