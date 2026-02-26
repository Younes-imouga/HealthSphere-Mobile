import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import type { Workout } from '../context/WorkoutsContext';

const INTENSITY_COLOR: Record<Workout['intensity'], string> = {
  faible: '#4D9EFF',
  moyenne: '#FFB800',
  élevée: '#FF6B35',
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
  return date.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
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
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>{icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardType}>{workout.type}</Text>
        <View style={styles.cardChips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {workout.duration} min</Text>
          </View>
          <View style={[styles.chip, { borderColor: color + '50' }]}
          >
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.chipText, { color }]}>{workout.intensity}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardDate}>{formatDate(workout.date)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginBottom: 10,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#00E5A010',
    borderWidth: 1,
    borderColor: '#00E5A020',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F2F7',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  cardChips: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: 10, fontWeight: '500', color: '#7A7F8E' },
  dot: { width: 5, height: 5, borderRadius: 3 },
  cardDate: { fontSize: 10, color: '#3D4150' },
});
