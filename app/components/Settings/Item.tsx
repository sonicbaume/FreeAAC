import { FONT_SIZE, FONT_WEIGHT, GAP, PADDING, RADIUS } from '@/app/utils/theme';
import Slider from '@react-native-community/slider';
import { JSX } from 'react';
import { StyleSheet, Switch, Text, View } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

interface SettingItemBase {
  title: string;
  description?: string;
  rightButton?: JSX.Element;
}

interface SettingsItemToggle extends SettingItemBase {
  type: 'toggle';
  value: boolean;
  setValue: (val: boolean) => void;
  labels?: string[];
}

interface SettingsItemSlider extends SettingItemBase {
  type: 'slider';
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  step?: number;
}

interface SettingsItemSelect extends SettingItemBase {
  type: 'select';
  value: string | undefined;
  setValue: (val: string | undefined) => void;
  items: {
    label: string;
    value: string;
  }[]
}

export default function SettingsItem(props: SettingsItemToggle | SettingsItemSlider | SettingsItemSelect) {
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
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: GAP.lg}}>
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
    : props.type === 'select' ? (
      <Dropdown
        style={styles.dropdown}
        data={props.items}
        value={props.value}
        onChange={item => props.setValue(item.value)}
        labelField="label"
        valueField="value"
        selectedTextStyle={{ fontSize: FONT_SIZE.sm, cursor: 'default' }}
        itemTextStyle={{ fontSize: FONT_SIZE.sm }}
      />
    )
    : null

  return (
    <View style={styles.container}>
      <View style={{
        display: 'flex',
        flexShrink: 1,
      }}>
        <Text style={styles.title}>{props.title}</Text>
        {props.description &&
        <Text style={styles.description}>{props.description}</Text>
        }
      </View>
      <View style={styles.rightContainer}>
        {component}
        {props.rightButton}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: PADDING.xl,
    justifyContent: 'space-between',
    gap: GAP.xl,
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP.md
  },
  title: {
    fontSize: FONT_SIZE.md,
  },
  description: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.light,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: RADIUS.md,
    paddingHorizontal: PADDING.lg,
    minWidth: 150,
    minHeight: 30,
  }
})