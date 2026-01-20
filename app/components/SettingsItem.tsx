import Slider from '@react-native-community/slider';
import { StyleSheet, Switch, Text, View } from "react-native";

interface SettingItemBase {
  title: string;
  description?: string;
}

interface SettingsItemToggle extends SettingItemBase {
  type: 'toggle';
  value: boolean;
  setValue: (val: boolean) => void;
  labels: string[];
}

interface SettingsItemSlider extends SettingItemBase {
  type: 'slider';
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  step?: number;
}

export default function SettingsItem(props: SettingsItemToggle | SettingsItemSlider) {
  const component =
    props.type === 'toggle' ? (
      <View style={{display: 'flex', alignItems: 'center'}}>
        <Switch value={props.value} onValueChange={props.setValue} />
        {props.labels && 
        <Text style={{textAlign: 'center', fontSize: 12}}>
          {props.labels.at(Number(props.value))}
        </Text>}
      </View>)
    : props.type === 'slider' ? (
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Text>{props.value.toFixed(1)}</Text>
        <Slider
          style={{width: 100, height: 40}}
          value={props.value}
          onValueChange={props.setValue}
          minimumValue={props.min}
          maximumValue={props.max}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          step={props.step}
        />
      </View>)
    : null

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{props.title}</Text>
        {props.description && <Text style={styles.description}>{props.description}</Text>}
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