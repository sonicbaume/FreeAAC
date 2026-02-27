import { Text } from '@/app/components/Styled';
import { FONT_SIZE, FONT_WEIGHT, GAP, PADDING, useTheme } from '@/app/utils/theme';
import { JSX } from 'react';
import { StyleSheet, Switch, View } from "react-native";
import SheetPicker from '../SheetPicker';

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

interface SettingsItemSelect extends SettingItemBase {
  type: 'select';
  value: string | undefined;
  setValue: (val: string | undefined) => void;
  items: {
    label: string;
    value: string;
  }[]
}

export default function SettingsItem(props: SettingsItemToggle | SettingsItemSelect) {
  const theme = useTheme()
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
    : props.type === 'select' ? (
      <SheetPicker
        items={props.items}
        value={props.value}
        onChange={item => props.setValue(item.value)}
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
})