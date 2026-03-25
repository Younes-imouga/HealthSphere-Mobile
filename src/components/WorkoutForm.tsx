import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import type {
    Intensity,
    WorkoutInput,
    WorkoutType,
} from "../context/WorkoutsExercicesContext";
import {
    BORDER_RADIUS,
    COLORS,
    FONT_SIZES,
    FONT_WEIGHT,
    SPACING,
} from "../theme/constants";

type Props = {
  initialValues?: Partial<WorkoutInput>;
  onSubmit: (input: WorkoutInput) => Promise<void> | void;
  submitLabel?: string;
};

const WORKOUT_TYPES: WorkoutType[] = ["Course", "Musculation", "Vélo", "Yoga"];
const INTENSITIES: Intensity[] = ["faible", "moyenne", "élevée"];

const ACTIVITY_ICONS: Record<WorkoutType, string> = {
  Course: "🏃",
  Musculation: "🏋️",
  Vélo: "🚴",
  Yoga: "🧘",
};

const INTENSITY_COLORS: Record<Intensity, string> = {
  faible: COLORS.status.info,
  moyenne: COLORS.status.warning,
  élevée: COLORS.status.error,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
}

export default function WorkoutForm({
  initialValues,
  onSubmit,
  submitLabel = "Add",
}: Props) {
  const [type, setType] = useState<WorkoutType | undefined>(
    initialValues?.type,
  );
  const [durationText, setDurationText] = useState(
    initialValues?.duration != null ? String(initialValues.duration) : "",
  );
  const [intensity, setIntensity] = useState<Intensity | undefined>(
    initialValues?.intensity,
  );
  const [date, setDate] = useState<Date>(initialValues?.date ?? new Date());
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const duration = useMemo(() => {
    const n = Number(durationText);
    return Number.isFinite(n) ? n : NaN;
  }, [durationText]);

  const validate = () => {
    if (!type) return "Please select an activity type.";
    if (!Number.isFinite(duration) || duration <= 0)
      return "Please enter a valid duration.";
    if (!intensity) return "Please select an intensity level.";
    if (!date || Number.isNaN(date.getTime()))
      return "Please select a valid date.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation", error);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        type: type as WorkoutType,
        duration: Math.round(duration),
        intensity: intensity as Intensity,
        date,
        notes: notes.trim() ? notes.trim() : undefined,
      });
    } catch {
      Alert.alert("Error", "Unable to add the session.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Activity Type */}
      <View style={styles.field}>
        <Text style={styles.label}>Activity Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScroll}
        >
          {WORKOUT_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeCard, type === t && styles.typeCardSelected]}
              onPress={() => setType(t)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.typeIcon, type === t && styles.typeIconSelected]}
              >
                {ACTIVITY_ICONS[t]}
              </Text>
              <Text
                style={[
                  styles.typeLabel,
                  type === t && styles.typeLabelSelected,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Duration Input */}
      <View style={styles.field}>
        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          value={durationText}
          onChangeText={setDurationText}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
          placeholder="Ex: 45"
          placeholderTextColor={COLORS.text.tertiary}
          style={styles.input}
        />
      </View>

      {/* Intensity Selection */}
      <View style={styles.field}>
        <Text style={styles.label}>Intensity</Text>
        <View style={styles.intensityRow}>
          {INTENSITIES.map((i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.intensityButton,
                intensity === i && styles.intensityButtonSelected,
                intensity === i && {
                  backgroundColor: INTENSITY_COLORS[i] + "15",
                  borderColor: INTENSITY_COLORS[i],
                },
              ]}
              onPress={() => setIntensity(i)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.intensityText,
                  intensity === i && {
                    color: INTENSITY_COLORS[i],
                    fontWeight: FONT_WEIGHT.bold,
                  },
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Date Picker */}
      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={date}
            onChange={(_event: DateTimePickerEvent, selected?: Date) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Add your comments about the session..."
          placeholderTextColor={COLORS.text.tertiary}
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={submitting}
      >
        <Text style={styles.submitText}>
          {submitting ? "Enregistrement..." : submitLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  typeScroll: {
    gap: SPACING.md,
    paddingRight: SPACING.md,
  },
  typeCard: {
    minWidth: 90,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: "center",
    gap: SPACING.xs,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  typeCardSelected: {
    backgroundColor: COLORS.brand.light,
    borderColor: COLORS.brand.primary,
  },
  typeIcon: {
    fontSize: 36,
  },
  typeIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  typeLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: "center",
  },
  typeLabelSelected: {
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  input: {
    height: 56,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.lg,
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textarea: {
    height: 120,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    textAlignVertical: "top",
  },
  intensityRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  intensityButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    backgroundColor: COLORS.background.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  intensityButtonSelected: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  intensityText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.text.secondary,
    textTransform: "capitalize",
  },
  dateButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  submitButton: {
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.lg,
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.text.inverse,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZES.base,
  },
});
