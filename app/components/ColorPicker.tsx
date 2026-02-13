import { Ban } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const defaultColors = [
  "#EB9694",
  "#FAD0C3",
  "#FEF3BD",
  "#C1E1C5",
  "#BEDADC",
  "#C4DEF6",
  "#BED3F3",
  "#D4C4FB",
  "#AAAAAA",
  "#B80000",
  "#DB3E00",
  "#FCCB00",
  "#008B02",
  "#007B76",
  "#1273DE",
  "#004DCF",
  "#5300EB",
  "#555555",
  "#000000",
];

export default function ColorPicker({
  color,
  onChange,
  label,
}: {
  color: string | undefined;
  onChange: (color: string | undefined) => void;
  label: string;
}) {
  const colors = !color || defaultColors.includes(color)
    ? defaultColors
    : [...defaultColors, color]
  return <View>
    <Text style={{ fontSize: 16 }}>{label}</Text>
    <ScrollView nestedScrollEnabled horizontal style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Pressable
        style={{
          ...styles.colorButton,
          ...(!color && styles.colorSelected),
        }}
        onPress={() => onChange(undefined)}
      >
        <Ban size={30} color="grey" />
      </Pressable>
      {colors.map((colorChoice) => (
        <Pressable
          key={colorChoice}
          style={{
            ...styles.colorButton,
            backgroundColor: colorChoice,
            ...(colorChoice === color && styles.colorSelected),
          }}
          onPress={() => onChange(colorChoice)}
        />
      ))}
    </ScrollView>
  </View>
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 0,
    height: 60
  },
  colorButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  colorSelected: {
    outlineWidth: 2,
    outlineColor: "white",
    outlineStyle: "solid",
    zIndex: 1,
    boxShadow: "1px 1px 10px black",
  }
});