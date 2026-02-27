import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { useWorkouts } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING, BORDER_RADIUS } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

const ACTIVITY_ICONS: Record<string, string> = {
  Course: '🏃',
  Musculation: '🏋️',
  Vélo: '🚴',
  HIIT: '⚡',
  Yoga: '🧘',
};

const INTENSITY_COLORS: Record<string, string> = {
  faible: COLORS.status.info,
  moyenne: COLORS.status.warning,
  élevée: COLORS.status.error,
};

export default function WorkoutDetailsScreen({ route, navigation }: Props) {
  const { getWorkoutById, removeWorkout } = useWorkouts();
  const workout = getWorkoutById(route.params.id);

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Séance introuvable</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.buttonText}>← Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText}>← Retour</Text>
            </TouchableOpacity>
            <View style={styles.iconWrap}>
              <Text style={styles.icon}>{ACTIVITY_ICONS[workout.type] || '💪'}</Text>
            </View>
            <Text style={styles.title}>{workout.type}</Text>
            <Text style={styles.subtitle}>
              {new Date(workout.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{workout.duration}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={[styles.statValue, { color: INTENSITY_COLORS[workout.intensity], fontSize: FONT_SIZES.lg, paddingTop: 4 }]}>
                {workout.intensity.toUpperCase()}
              </Text>
              <Text style={styles.statLabel}>Intensité</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>~{Math.round(workout.duration * 8.5)}</Text>
              <Text style={styles.statLabel}>kcal est.</Text>
            </View>
          </View>

          {/* Intensity Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intensité</Text>
            <View style={[styles.intensityBadge, {
              backgroundColor: INTENSITY_COLORS[workout.intensity] + '15',
              borderColor: INTENSITY_COLORS[workout.intensity] + '40',
            }]}>
              <Text style={styles.intensityBadgeIcon}>🔥</Text>
              <Text style={[styles.intensityBadgeText, { color: INTENSITY_COLORS[workout.intensity] }]}>
                Intensité {workout.intensity}
              </Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {workout.notes || 'Aucune note pour cette séance.'}
              </Text>
            </View>
          </View>

          {/* Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: '82%' }]} />
            </View>
            <Text style={styles.performanceText}>Durée supérieure à votre moyenne (+12%)</Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              Alert.alert('Supprimer', 'Voulez-vous supprimer cette séance ?', [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Supprimer',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await removeWorkout(workout.id);
                      navigation.goBack();
                    } catch {
                      Alert.alert('Erreur', 'Impossible de supprimer la séance.');
                    }
                  },
                },
              ]);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBtnText}>🗑 Supprimer cette séance</Text>
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    paddingBottom: SPACING.xl,
  },
  hero: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
  },
  backBtn: {
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  backBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  iconWrap: {
    width: 84,
    height: 84,
    backgroundColor: COLORS.brand.secondary,
    borderWidth: 1,
    borderColor: COLORS.brand.primary + '30',
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 42,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: -30,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  statItem: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border.primary,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  intensityBadgeIcon: {
    fontSize: FONT_SIZES.lg,
  },
  intensityBadgeText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.bold,
  },
  noteBox: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  noteText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 3,
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brand.primary,
    borderRadius: 3,
  },
  performanceText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  deleteBtn: {
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.status.error + '30',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.status.error + '80',
  },
  button: {
    height: 52,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
});
