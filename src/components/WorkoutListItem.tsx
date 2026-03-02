import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { Workout } from "../context/WorkoutsContext";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZES,
    FONT_WEIGHT,
    SPACING,
} from "../theme/constants";

const INTENSITY_COLOR: Record<Workout["intensity"], string> = {
  faible: COLORS.intensity.faible,
  moyenne: COLORS.intensity.moyenne,
  élevée: COLORS.intensity.élevée,
};

const TYPE_ICON: Record<Workout["type"], string> = {
  Course: "🏃",
  Musculation: "🏋️",
  Vélo: "🚴",
  Yoga: "🧘",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.toLocaleDateString("fr-FR", { day: "2-digit" });
  const month = date.toLocaleDateString("fr-FR", { month: "short" });
  return { day, month };
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
  const { day, month } = formatDate(workout.date);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Icon Section */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.type}>{workout.type}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>⏱ {workout.duration} min</Text>
          <Text style={styles.metaSeparator}>•</Text>
          <Text style={[styles.metaText, { color }]}>{workout.intensity}</Text>
        </View>
      </View>

      {/* Date Badge */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.brand.light,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
  },
  type: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHT.medium,
  },
  metaSeparator: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
  },
  dateBadge: {
    backgroundColor: COLORS.brand.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    minWidth: 50,
  },
  dateDay: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.inverse,
  },
  dateMonth: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.inverse,
    textTransform: "uppercase",
    fontWeight: FONT_WEIGHT.medium,
    opacity: 0.9,
  },
});
