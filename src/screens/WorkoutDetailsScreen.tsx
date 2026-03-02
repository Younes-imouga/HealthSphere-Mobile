import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useWorkouts } from "../context/WorkoutsContext";
import type { RootStackParamList } from "../navigation/AppNavigator";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHT,
  SPACING,
} from "../theme/constants";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDetails">;

const ACTIVITY_ICONS: Record<string, string> = {
  Course: "🏃",
  Musculation: "🏋️",
  Vélo: "🚴",
  Yoga: "🧘",
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
        <Text style={styles.title}>Session not found</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background.primary}
      />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Session Details</Text>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <Text style={styles.heroIcon}>
              {ACTIVITY_ICONS[workout.type] || "💪"}
            </Text>
            <Text style={styles.heroTitle}>{workout.type}</Text>
            <Text style={styles.heroDate}>
              {new Date(workout.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏱</Text>
              <Text style={styles.statValue}>{workout.duration}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: INTENSITY_COLORS[workout.intensity] },
                ]}
              >
                {workout.intensity}
              </Text>
              <Text style={styles.statLabel}>Intensity</Text>
            </View>
          </View>

          {/* Notes Section */}
          {workout.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Notes</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>{workout.notes}</Text>
              </View>
            </View>
          )}

          {!workout.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Notes</Text>
              <View style={styles.emptyNotesCard}>
                <Text style={styles.emptyNotesText}>
                  No notes for this session
                </Text>
              </View>
            </View>
          )}

          {/* Delete Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert(
                  "Delete",
                  "Are you sure you want to delete this session?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        try {
                          await removeWorkout(workout.id);
                          navigation.goBack();
                        } catch {
                          Alert.alert("Error", "Unable to delete the session.");
                        }
                      },
                    },
                  ],
                );
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteButtonText}>🗑 Delete Session</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  backIcon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary,
  },
  heroCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.brand.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: "center",
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  heroTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.inverse,
    marginBottom: SPACING.sm,
  },
  heroDate: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.inverse,
    opacity: 0.9,
    textTransform: "capitalize",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    fontSize: FONT_SIZES.xl,
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    textAlign: "center",
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textTransform: "uppercase",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  notesCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.brand.primary,
  },
  notesText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  emptyNotesCard: {
    backgroundColor: COLORS.background.tertiary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
  },
  emptyNotesText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    fontStyle: "italic",
  },
  performanceCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  performanceLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  performanceValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
  },
  performanceBarBg: {
    height: 8,
    backgroundColor: COLORS.background.quaternary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: "hidden",
    marginBottom: SPACING.sm,
  },
  performanceBarFill: {
    height: "100%",
    backgroundColor: COLORS.brand.primary,
    borderRadius: BORDER_RADIUS.sm,
  },
  performanceHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
  },
  deleteButton: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.status.error + "30",
  },
  deleteButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.status.error,
  },
  button: {
    height: 52,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
});
