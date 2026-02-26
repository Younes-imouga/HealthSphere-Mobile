import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHT, SPACING } from '../theme/constants';

interface PickerItem {
  label: string;
  value: string | number;
}

interface PickerProps {
  selectedValue: string | number;
  onValueChange: (value: string | number, index: number) => void;
  items: PickerItem[];
  placeholder?: string;
  label?: string;
  testID?: string;
  style?: any;
}

export default function CustomPicker({
  selectedValue,
  onValueChange,
  items,
  placeholder,
  label,
  testID,
  style,
}: PickerProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          testID={testID}
        >
          {placeholder && (
            <Picker.Item label={placeholder} value="" enabled={false} />
          )}
          {items.map((item, index) => (
            <Picker.Item
              key={`${item.value}-${index}`}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  picker: {
    color: COLORS.text.primary,
    height: 50,
  },
});
