import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';
import WorkoutListItem from '../components/WorkoutListItem';
import { useWorkouts } from '../context/WorkoutsContext';
import type { Workout } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING, BORDER_RADIUS } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { workouts } = useWorkouts();

  // Calculate real stats
  const totalMins = workouts.reduce((acc, w) => acc + w.duration, 0);
  const thisWeek = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length;
  const weeklyGoal = 4;
  const weeklyProgress = Math.min((thisWeek / weeklyGoal) * 100, 100);
  const durationGoal = 300;
  const durationProgress = Math.min((totalMins / durationGoal) * 100, 100);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      <FlatList
        data={workouts}
        keyExtractor={(item: Workout) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.title}>
                Votre <Text style={styles.titleAccent}>Dashboard</Text>
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statVal}>{workouts.length}</Text>
                <Text style={styles.statLbl}>Séances</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statVal}>{totalMins}</Text>
                <Text style={styles.statLbl}>Minutes</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statVal}>{thisWeek}</Text>
                <Text style={styles.statLbl}>Semaine</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLbl}>Objectif hebdomadaire</Text>
                <Text style={styles.progressVal}>{thisWeek} / {weeklyGoal} séances</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${weeklyProgress}%` }]} />
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLbl}>Durée totale</Text>
                <Text style={styles.progressVal}>{totalMins} / {durationGoal} min</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${durationProgress}%`, backgroundColor: COLORS.status.info }]} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dernières séances</Text>
          </>
        }
        renderItem={({ item }: { item: Workout }) => (
          <WorkoutListItem workout={item} onPress={() => navigation.navigate('WorkoutDetails', { id: item.id })} />
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate('AddWorkout')}
              activeOpacity={0.8}
            >
              <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkout')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  list: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHT.normal,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    lineHeight: 34,
  },
  titleAccent: {
    color: COLORS.brand.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statPill: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
  },
  statLbl: {
    fontSize: 9,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  progressSection: {
    marginBottom: SPACING.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  progressLbl: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  progressVal: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  barBg: {
    height: 4,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 2,
    marginBottom: SPACING.md,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.brand.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.md,
  },
  footer: {
    height: 100,
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    width: 52,
    height: 52,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.background.primary,
    lineHeight: 24,
  },
});
