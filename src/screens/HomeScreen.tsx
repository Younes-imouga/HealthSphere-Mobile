import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
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
          ListFooterComponent={<View style={styles.listFooter} />}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddWorkout')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  safe: {
    flex: 1,
  },
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    lineHeight: 40,
  },
  titleAccent: {
    color: COLORS.brand.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statPill: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statVal: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
  },
  statLbl: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  progressSection: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background.secondary + '50',
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLbl: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  progressVal: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  barBg: {
    height: 6,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 3,
    marginBottom: SPACING.lg,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.brand.primary,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.lg,
    opacity: 0.8,
  },
  listFooter: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 64,
    height: 64,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabText: {
    fontSize: 36,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.background.primary,
    marginTop: -4,
  },
});
