import { FONT_SIZE, GAP, ICON_SIZE, PADDING, RADIUS, useTheme } from '@/app/utils/theme';
import { Href, Link } from 'expo-router';
import { StyleSheet, Text } from "react-native";
import { Button } from '../Styled';

export default function LinkButton ({
  href,
  title,
  icon,
}: {
  href: Href;
  title: string;
  icon?: any;
}) {
  const Icon = icon
  const theme = useTheme()
  return (
    <Link href={href} asChild>
      <Button>
        {Icon && <Icon size={ICON_SIZE.md} color={theme.onSecondary} />}
        <Text style={styles.text}>{title}</Text>
      </Button>
    </Link>
  )
}

const styles = StyleSheet.create({
  outsideContainer: {
    padding: PADDING.md,
    boxShadow: 'lightgrey 2px 2px 5px',
    borderRadius: RADIUS.lg,
    cursor: 'pointer',
    backgroundColor: "white"
  },
  insideContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: GAP.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: FONT_SIZE.md
  }
})