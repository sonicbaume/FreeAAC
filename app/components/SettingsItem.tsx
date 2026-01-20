import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsItem({
  title,
  description,
  type,
  value,
  setValue,
  toggleLabels,
}: {
  title: string;
  description?: string;
  type: 'toggle'
  value: any;
  setValue: (val: any) => void;
  toggleLabels?: string[]
}) {
  const component = type === 'toggle'
    ? <View style={{display: 'flex', alignItems: 'center'}}>
        <Switch value={value} onValueChange={setValue} />
        {toggleLabels && <Text style={{textAlign: 'center', fontSize: 12}}>{toggleLabels.at(value)}</Text>}
      </View>
    : null;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {component}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 15,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 12,
    fontWeight: 'light',
  },
})