import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHT } from '../theme/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  testID?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  testID,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  primary: {
    backgroundColor: COLORS.brand.primary,
  },
  secondary: {
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  danger: {
    backgroundColor: COLORS.status.error,
  },
  disabled: {
    backgroundColor: COLORS.background.quaternary,
    opacity: 0.5,
  },
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  primaryText: {
    color: COLORS.text.inverse,
  },
  secondaryText: {
    color: COLORS.text.primary,
  },
  dangerText: {
    color: COLORS.text.primary,
  },
  disabledText: {
    color: COLORS.text.secondary,
  },
});
