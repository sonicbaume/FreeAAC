import { createContext, useContext } from "react";

export const themes = {
  light: {
    "primary": "#8F4C38",
    "surfaceTint": "#8F4C38",
    "onPrimary": "#FFFFFF",
    "primaryContainer": "#FFDBD1",
    "onPrimaryContainer": "#723523",
    "secondary": "#77574E",
    "onSecondary": "#FFFFFF",
    "secondaryContainer": "#FFDBD1",
    "onSecondaryContainer": "#5D4037",
    "tertiary": "#6C5D2F",
    "onTertiary": "#FFFFFF",
    "tertiaryContainer": "#F5E1A7",
    "onTertiaryContainer": "#534619",
    "error": "#BA1A1A",
    "onError": "#FFFFFF",
    "errorContainer": "#FFDAD6",
    "onErrorContainer": "#93000A",
    "background": "#FFF8F6",
    "onBackground": "#231917",
    "surface": "#FFF8F6",
    "onSurface": "#231917",
    "surfaceVariant": "#F5DED8",
    "onSurfaceVariant": "#53433F",
    "outline": "#85736E",
    "outlineVariant": "#D8C2BC",
    "shadow": "#000000",
    "scrim": "#000000",
    "inverseSurface": "#392E2B",
    "inverseOnSurface": "#FFEDE8",
    "inversePrimary": "#FFB5A0",
    "primaryFixed": "#FFDBD1",
    "onPrimaryFixed": "#3A0B01",
    "primaryFixedDim": "#FFB5A0",
    "onPrimaryFixedVariant": "#723523",
    "secondaryFixed": "#FFDBD1",
    "onSecondaryFixed": "#2C150F",
    "secondaryFixedDim": "#E7BDB2",
    "onSecondaryFixedVariant": "#5D4037",
    "tertiaryFixed": "#F5E1A7",
    "onTertiaryFixed": "#231B00",
    "tertiaryFixedDim": "#D8C58D",
    "onTertiaryFixedVariant": "#534619",
    "surfaceDim": "#E8D6D2",
    "surfaceBright": "#FFF8F6",
    "surfaceContainerLowest": "#FFFFFF",
    "surfaceContainerLow": "#FFF1ED",
    "surfaceContainer": "#FCEAE5",
    "surfaceContainerHigh": "#F7E4E0",
    "surfaceContainerHighest": "#F1DFDA"
  },
  dark: {
    "primary": "#FFB5A0",
    "surfaceTint": "#FFB5A0",
    "onPrimary": "#561F0F",
    "primaryContainer": "#723523",
    "onPrimaryContainer": "#FFDBD1",
    "secondary": "#E7BDB2",
    "onSecondary": "#442A22",
    "secondaryContainer": "#5D4037",
    "onSecondaryContainer": "#FFDBD1",
    "tertiary": "#D8C58D",
    "onTertiary": "#3B2F05",
    "tertiaryContainer": "#534619",
    "onTertiaryContainer": "#F5E1A7",
    "error": "#FFB4AB",
    "onError": "#690005",
    "errorContainer": "#93000A",
    "onErrorContainer": "#FFDAD6",
    "background": "#1A110F",
    "onBackground": "#F1DFDA",
    "surface": "#1A110F",
    "onSurface": "#F1DFDA",
    "surfaceVariant": "#53433F",
    "onSurfaceVariant": "#D8C2BC",
    "outline": "#A08C87",
    "outlineVariant": "#53433F",
    "shadow": "#000000",
    "scrim": "#000000",
    "inverseSurface": "#F1DFDA",
    "inverseOnSurface": "#392E2B",
    "inversePrimary": "#8F4C38",
    "primaryFixed": "#FFDBD1",
    "onPrimaryFixed": "#3A0B01",
    "primaryFixedDim": "#FFB5A0",
    "onPrimaryFixedVariant": "#723523",
    "secondaryFixed": "#FFDBD1",
    "onSecondaryFixed": "#2C150F",
    "secondaryFixedDim": "#E7BDB2",
    "onSecondaryFixedVariant": "#5D4037",
    "tertiaryFixed": "#F5E1A7",
    "onTertiaryFixed": "#231B00",
    "tertiaryFixedDim": "#D8C58D",
    "onTertiaryFixedVariant": "#534619",
    "surfaceDim": "#1A110F",
    "surfaceBright": "#423734",
    "surfaceContainerLowest": "#140C0A",
    "surfaceContainerLow": "#231917",
    "surfaceContainer": "#271D1B",
    "surfaceContainerHigh": "#322825",
    "surfaceContainerHighest": "#3D322F"
  }
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