import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WorkoutListItem from "../components/WorkoutListItem";
import type { Workout } from "../context/WorkoutsContext";
import { useWorkouts } from "../context/WorkoutsContext";
import type { RootStackParamList } from "../navigation/AppNavigator";
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  FONT_WEIGHT,
  SPACING,
} from "../theme/constants";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { workouts } = useWorkouts();

  const totalMins = workouts.reduce((acc, w) => acc + w.duration, 0);
  const thisWeek = workouts.filter((w) => {
    const workoutDate = new Date(w.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length;

  const faibleCount = workouts.filter((w) => w.intensity === "faible").length;
  const moyenneCount = workouts.filter((w) => w.intensity === "moyenne").length;
  const élevéeCount = workouts.filter((w) => w.intensity === "élevée").length;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background.primary}
      />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <FlatList
          data={workouts}
          keyExtractor={(item: Workout) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.greeting}>Hello 👋</Text>
                <Text style={styles.title}>My Activities</Text>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{workouts.length}</Text>
                  <Text style={styles.statLabel}>Sessions</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{totalMins}</Text>
                  <Text style={styles.statLabel}>Minutes</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{thisWeek}</Text>
                  <Text style={styles.statLabel}>This Week</Text>
                </View>
              </View>

              <View style={styles.intensityStatsContainer}>
                <View style={styles.intensityStatCard}>
                  <View
                    style={[
                      styles.intensityDot,
                      { backgroundColor: COLORS.intensity.faible },
                    ]}
                  />
                  <View style={styles.intensityStatContent}>
                    <Text style={styles.intensityStatLabel}>Easy</Text>
                    <Text style={styles.intensityStatCount}>{faibleCount}</Text>
                  </View>
                </View>
                <View style={styles.intensityStatCard}>
                  <View
                    style={[
                      styles.intensityDot,
                      { backgroundColor: COLORS.intensity.moyenne },
                    ]}
                  />
                  <View style={styles.intensityStatContent}>
                    <Text style={styles.intensityStatLabel}>Medium</Text>
                    <Text style={styles.intensityStatCount}>
                      {moyenneCount}
                    </Text>
                  </View>
                </View>
                <View style={styles.intensityStatCard}>
                  <View
                    style={[
                      styles.intensityDot,
                      { backgroundColor: COLORS.intensity.élevée },
                    ]}
                  />
                  <View style={styles.intensityStatContent}>
                    <Text style={styles.intensityStatLabel}>Hard</Text>
                    <Text style={styles.intensityStatCount}>{élevéeCount}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activities</Text>
                <Text style={styles.sectionCount}>{workouts.length}</Text>
              </View>
            </>
          }
          renderItem={({ item }: { item: Workout }) => (
            <WorkoutListItem
              workout={item}
              onPress={() =>
                navigation.navigate("WorkoutDetails", { id: item.id })
              }
            />
          )}
          ListFooterComponent={<View style={styles.listFooter} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🏃♂️</Text>
              <Text style={styles.emptyTitle}>No Sessions</Text>
              <Text style={styles.emptySubtitle}>
                Start your fitness journey
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("AddWorkout")}
          activeOpacity={0.8}
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
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
  },
  statsContainer: {
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
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
  statValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brand.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  intensityStatsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  intensityStatCard: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  intensityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  intensityStatContent: {
    flex: 1,
  },
  intensityStatLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  intensityStatCount: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
  },
  sectionCount: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.inverse,
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    overflow: "hidden",
  },
  listFooter: {
    height: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xxl * 2,
    paddingHorizontal: SPACING.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: SPACING.xl,
    right: SPACING.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: COLORS.text.inverse,
    fontWeight: FONT_WEIGHT.normal,
  },
});
