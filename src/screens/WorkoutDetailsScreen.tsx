import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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
      <View style={styles.container}>
        <Text style={styles.title}>Séance introuvable</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.buttonText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Retour</Text>
          </TouchableOpacity>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{ACTIVITY_ICONS[workout.type] || '💪'}</Text>
          </View>
          <Text style={styles.title}>{workout.type}</Text>
          <Text style={styles.subtitle}>{new Date(workout.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout.duration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={[styles.statItem, styles.statBorder]}>
            <Text style={[styles.statValue, { color: INTENSITY_COLORS[workout.intensity], fontSize: FONT_SIZES.md, paddingTop: SPACING.xs }]}>
              {workout.intensity.toUpperCase()}
            </Text>
            <Text style={styles.statLabel}>Intensité</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>~{Math.round(workout.duration * 8.5)}</Text>
            <Text style={styles.statLabel}>kcal est.</Text>
          </View>
        </View>

        {/* Intensity Badge */}
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
          activeOpacity={0.85}
        >
          <Text style={styles.deleteBtnText}>🗑 Supprimer cette séance</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    padding: 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  hero: {
    backgroundColor: COLORS.brand.secondary + '15',
    padding: SPACING.xl + SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
  },
  backBtn: {
    marginBottom: SPACING.md,
  },
  backBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  iconWrap: {
    width: 72,
    height: 72,
    backgroundColor: COLORS.brand.secondary + '15',
    borderWidth: 1,
    borderColor: COLORS.brand.primary + '30',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 34,
  },
  title: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border.primary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
  },
  intensityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderRadius: 10,
    padding: SPACING.sm + SPACING.xs,
  },
  intensityBadgeIcon: {
    fontSize: FONT_SIZES.md,
  },
  intensityBadgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  noteBox: {
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  noteText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brand.primary,
    borderRadius: 2,
  },
  performanceText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  deleteBtn: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.status.error + '30',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.status.error + '80',
  },
  button: {
    height: 44,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
