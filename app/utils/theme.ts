import { createContext, useContext } from "react";

export const themes = {
  "light": {
      "primary": "#5D5E5F",
      "surfaceTint": "#5D5E5F",
      "onPrimary": "#FFFFFF",
      "primaryContainer": "#CCCCCC",
      "onPrimaryContainer": "#555657",
      "secondary": "#5F5E5E",
      "onSecondary": "#FFFFFF",
      "secondaryContainer": "#E4E2E1",
      "onSecondaryContainer": "#656464",
      "tertiary": "#605E60",
      "onTertiary": "#FFFFFF",
      "tertiaryContainer": "#CFCBCD",
      "onTertiaryContainer": "#575557",
      "error": "#BA1A1A",
      "onError": "#FFFFFF",
      "errorContainer": "#FFDAD6",
      "onErrorContainer": "#93000A",
      "background": "#FCF8F8",
      "onBackground": "#1C1B1B",
      "surface": "#FCF8F8",
      "onSurface": "#1C1B1B",
      "surfaceVariant": "#E0E3E3",
      "onSurfaceVariant": "#444748",
      "outline": "#747878",
      "outlineVariant": "#C4C7C7",
      "shadow": "#000000",
      "scrim": "#000000",
      "inverseSurface": "#313030",
      "inverseOnSurface": "#F4F0EF",
      "inversePrimary": "#C6C6C6",
      "primaryFixed": "#E3E2E2",
      "onPrimaryFixed": "#1A1C1C",
      "primaryFixedDim": "#C6C6C6",
      "onPrimaryFixedVariant": "#464747",
      "secondaryFixed": "#E4E2E1",
      "onSecondaryFixed": "#1B1C1C",
      "secondaryFixedDim": "#C8C6C6",
      "onSecondaryFixedVariant": "#474747",
      "tertiaryFixed": "#E6E1E3",
      "onTertiaryFixed": "#1C1B1D",
      "tertiaryFixedDim": "#C9C5C7",
      "onTertiaryFixedVariant": "#484648",
      "surfaceDim": "#DDD9D9",
      "surfaceBright": "#FCF8F8",
      "surfaceContainerLowest": "#FFFFFF",
      "surfaceContainerLow": "#F7F3F2",
      "surfaceContainer": "#F1EDEC",
      "surfaceContainerHigh": "#EBE7E7",
      "surfaceContainerHighest": "#E5E2E1"
  },
  "dark": {
      "primary": "#E8E8E8",
      "surfaceTint": "#C6C6C6",
      "onPrimary": "#2F3131",
      "primaryContainer": "#CCCCCC",
      "onPrimaryContainer": "#555657",
      "secondary": "#C8C6C6",
      "onSecondary": "#303030",
      "secondaryContainer": "#474747",
      "onSecondaryContainer": "#B6B5B4",
      "tertiary": "#ECE7E9",
      "onTertiary": "#313032",
      "tertiaryContainer": "#CFCBCD",
      "onTertiaryContainer": "#575557",
      "error": "#FFB4AB",
      "onError": "#690005",
      "errorContainer": "#93000A",
      "onErrorContainer": "#FFDAD6",
      "background": "#141313",
      "onBackground": "#E5E2E1",
      "surface": "#141313",
      "onSurface": "#E5E2E1",
      "surfaceVariant": "#444748",
      "onSurfaceVariant": "#C4C7C7",
      "outline": "#8E9192",
      "outlineVariant": "#444748",
      "shadow": "#000000",
      "scrim": "#000000",
      "inverseSurface": "#E5E2E1",
      "inverseOnSurface": "#313030",
      "inversePrimary": "#5D5E5F",
      "primaryFixed": "#E3E2E2",
      "onPrimaryFixed": "#1A1C1C",
      "primaryFixedDim": "#C6C6C6",
      "onPrimaryFixedVariant": "#464747",
      "secondaryFixed": "#E4E2E1",
      "onSecondaryFixed": "#1B1C1C",
      "secondaryFixedDim": "#C8C6C6",
      "onSecondaryFixedVariant": "#474747",
      "tertiaryFixed": "#E6E1E3",
      "onTertiaryFixed": "#1C1B1D",
      "tertiaryFixedDim": "#C9C5C7",
      "onTertiaryFixedVariant": "#484648",
      "surfaceDim": "#141313",
      "surfaceBright": "#3A3939",
      "surfaceContainerLowest": "#0E0E0E",
      "surfaceContainerLow": "#1C1B1B",
      "surfaceContainer": "#201F1F",
      "surfaceContainerHigh": "#2A2A2A",
      "surfaceContainerHighest": "#353434"
  },
};

export const ThemeContext = createContext(themes.light)

export const useTheme = () => useContext(ThemeContext)

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const PADDING = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 18,
  xxl: 24,
} as const;

export const GAP = {
  xs: 4,
  md: 8,
  lg: 12,
  xl: 18,
  xxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;

export const FONT_WEIGHT = {
  regular: 'normal',
  medium: '500',
  bold: 'bold',
  light: 'light',
  semi: '600',
} as const;

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  round: 9999,
} as const;

export const ICON_SIZE = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  xxl: 64,
} as const;

export const MAX_WIDTH = 600 as const;
export const HEADER_HEIGHT = 72 as const;