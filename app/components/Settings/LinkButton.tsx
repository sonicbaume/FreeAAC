import { FONT_SIZE, GAP, ICON_SIZE, PADDING, RADIUS } from '@/app/utils/theme';
import { Href, Link } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

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
  return (
    <Link href={href} style={styles.outsideContainer}>
      <View style={styles.insideContainer}>
        {Icon && <Icon size={ICON_SIZE.md} />}
        <Text style={styles.text}>{title}</Text>
      </View>
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