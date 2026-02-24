import { CircleSmall } from "lucide-react-native";
import { ICON_SIZE } from "../utils/theme";
import SheetPicker from "./SheetPicker";

const defaultColors = [
  { value: undefined, label: "(none)"},
  { value: "#EB9694", label: "Salmon" },
  { value: "#FAD0C3", label: "Pink" },
  { value: "#FEF3BD", label: "Cream" },
  { value: "#C1E1C5", label: "Pale Green" },
  { value: "#BEDADC", label: "Light Cyan" },
  { value: "#C4DEF6", label: "Sky Blue" },
  { value: "#BED3F3", label: "Light Blue" },
  { value: "#D4C4FB", label: "Lavender" },
  { value: "#AAAAAA", label: "Light Gray" },
  { value: "#B80000", label: "Dark Red" },
  { value: "#DB3E00", label: "Orange Red" },
  { value: "#FCCB00", label: "Yellow" },
  { value: "#008B02", label: "Green" },
  { value: "#007B76", label: "Teal" },
  { value: "#1273DE", label: "Azure" },
  { value: "#004DCF", label: "Blue" },
  { value: "#5300EB", label: "Violet" },
  { value: "#555555", label: "Dark Gray" },
  { value: "#000000", label: "Black" },
];

export default function ColorPicker({
  color,
  onChange,
}: {
  color: string | undefined;
  onChange: (color: string | undefined) => void;
}) {
  const colors = defaultColors
  const hasCurrentColor = !defaultColors.find(item => item.value === color)
  if (hasCurrentColor) colors.push({value: color, label: "(current color)"})
  const items = colors.map(color => { return {
    ...color,
    icon: color.value && <CircleSmall size={ICON_SIZE.md} fill={color.value} color={color.value} />,
  }})
  return (  
    <SheetPicker
      items={items}
      value={color}
      onChange={(item) => onChange(item.value)}
    />
  )
}