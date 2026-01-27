import { Href, Link } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

export default function LinkButton ({
  url,
  title,
  icon,
}: {
  url: Href;
  title: string;
  icon: any;
}) {
  const Icon = icon
  return (
    <Link href={url} style={styles.outsideContainer}>
      <View style={styles.insideContainer}>
        <Icon size={18} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  outsideContainer: {
    padding: 6,
    boxShadow: 'lightgrey 2px 2px 5px',
    borderRadius: 12,
    cursor: 'pointer',
    backgroundColor: "white"
  },
  insideContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 16
  }
})