import { Text } from '@/app/components/Styled';
import { FONT_SIZE, FONT_WEIGHT, GAP, PADDING, RADIUS, useTheme } from '@/app/utils/theme';
import Slider from '@react-native-community/slider';
import { JSX } from 'react';
import { StyleSheet, Switch, View } from "react-native";
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
  const theme = useTheme()
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
      backgroundColor: theme.surfaceBright,
      borderRadius: RADIUS.md,
      paddingHorizontal: PADDING.lg,
      minWidth: 150,
      minHeight: 30,
    },
    dropdownContainer: {
      backgroundColor: theme.surfaceBright,
      color: theme.onSurface
    },
    dropdownItemText: {
      fontSize: FONT_SIZE.sm,
      color: theme.onSurface
    },
    dropdownSelectedText: {
      fontSize: FONT_SIZE.sm,
      cursor: 'default',
      color: theme.inverseOnSurface
    }
  })

  const component =
    props.type === 'toggle' ? (
      <View style={{display: 'flex', alignItems: 'center'}}>
        <Switch
          value={props.value}
          onValueChange={props.setValue}
          thumbColor={theme.secondaryFixed}
          trackColor={{
            true: theme.secondary,
            false: theme.secondaryContainer
          }}
          ios_backgroundColor={theme.secondaryContainer}
          //@ts-ignore
          activeThumbColor={theme.secondaryFixed}
        />
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
          minimumTrackTintColor={theme.secondaryContainer}
          maximumTrackTintColor={theme.secondaryContainer}
          step={props.step}
          thumbTintColor={theme.secondary}
        />
      </View>)
    : props.type === 'select' ? (
      <Dropdown
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        data={props.items}
        value={props.value}
        onChange={item => props.setValue(item.value)}
        labelField="label"
        valueField="value"
        selectedTextStyle={styles.dropdownSelectedText}
        itemTextStyle={styles.dropdownItemText}
        placeholderStyle={styles.dropdownItemText}
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
