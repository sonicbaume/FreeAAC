import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { PADDING, RADIUS, useTheme } from "../utils/theme";

export const Button = ({
  children,
  variant = "secondary",
  style,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
    },
    primary: {
      backgroundColor: theme.primary
    },
    secondary: {
      backgroundColor: theme.secondary
    },
    outline: {
      backgroundColor: theme.surface
    },
    ghost: {

    }
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
