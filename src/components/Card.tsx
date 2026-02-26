import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHT, SPACING } from '../theme/constants';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onPress?: () => void;
  testID?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
}

export default function Card({
  children,
  title,
  onPress,
  testID,
  style,
  titleStyle,
  contentStyle,
}: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? { onPress, testID, activeOpacity: 0.75 }
    : { testID };

  return (
    <Wrapper style={[styles.card, style]} {...wrapperProps}>
      {title && (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  content: {
    // Content styles can be customized via contentStyle prop
  },
});
