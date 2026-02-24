import { Pressable, PressableProps, Text as RNText, StyleProp, StyleSheet, TextProps, TextStyle, ViewStyle } from "react-native";
import { GAP, PADDING, RADIUS, useTheme } from "../utils/theme";

export const Button = ({
  children,
  variant = "secondary",
  style,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  style?: StyleProp<ViewStyle>;
} & PressableProps) => {
  const theme = useTheme()
  const styles = StyleSheet.create({
    button: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: PADDING.md,
      borderRadius: RADIUS.md,
      gap: GAP.md
    },
    primary: { backgroundColor: theme.primary },
    secondary: { backgroundColor: theme.secondary },
    outline: {
      backgroundColor: theme.surface,
      borderColor: theme.secondary,
      borderWidth: 1
    },
    destructive: { backgroundColor: theme.error },
    ghost: { },
  })

  return (
    <Pressable
      style={[
        styles.button,
        styles[variant],
        style
      ]}
      {...props}
    >
      {children}
    </Pressable>
  )
}

export const Text = ({
  children,
  style,
  ...props
}: {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
} & TextProps) => {
  const theme = useTheme()
  return (
    <RNText
      style={[
        { color: theme.onSurface },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  )
}