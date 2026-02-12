import { Ban } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

const defaultColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#FFFFFF",
];

export default function ColorPicker({
  color,
  onChange,
}: {
  color: string | undefined;
  onChange: (color: string | undefined) => void;
}) {
  const colors = !color || defaultColors.includes(color)
    ? defaultColors
    : [...defaultColors, color]
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  colorButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
  },
  colorSelected: {
    outlineWidth: 2,
    outlineColor: "white",
    outlineStyle: "solid",
    zIndex: 1,
    boxShadow: "5px 5px 10px grey",
  }
});