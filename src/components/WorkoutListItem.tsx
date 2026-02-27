import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import type { Workout } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING, BORDER_RADIUS } from '../theme/constants';

const INTENSITY_COLOR: Record<Workout['intensity'], string> = {
  faible: COLORS.status.info,
  moyenne: COLORS.status.warning,
  élevée: COLORS.status.error,
};

const TYPE_ICON: Record<Workout['type'], string> = {
  Course: '🏃',
  Musculation: '🏋️',
  Vélo: '🚴',
  HIIT: '⚡',
  Yoga: '🧘',
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('fr-FR', { month: 'short', day: '2-digit' });
}

export default function WorkoutListItem({
  workout,
  onPress,
}: {
  workout: Workout;
  onPress: () => void;
}) {
  const color = INTENSITY_COLOR[workout.intensity];
  const icon = TYPE_ICON[workout.type];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>{icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardType}>{workout.type}</Text>
        <View style={styles.cardChips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {workout.duration} min</Text>
          </View>
          <View style={[styles.chip, { borderColor: color + '30' }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.chipText, { color }]}>{workout.intensity}</Text>
          </View>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.cardDate}>{formatDate(workout.date)}</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardIcon: {
    width: 56,
    height: 56,
    backgroundColor: COLORS.brand.secondary,
    borderWidth: 1,
    borderColor: COLORS.brand.primary + '20',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: {
    fontSize: 28
  },
  cardBody: {
    flex: 1
  },
  cardType: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    textTransform: 'capitalize',
    marginBottom: SPACING.xs,
  },
  cardChips: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center'
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.secondary
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  rightContent: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
    fontWeight: FONT_WEIGHT.medium,
  },
  arrow: {
    fontSize: 20,
    color: COLORS.text.tertiary,
    marginTop: -4,
  }
});
