import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import type { Intensity, WorkoutInput, WorkoutType } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING, BORDER_RADIUS } from '../theme/constants';

type Props = {
  initialValues?: Partial<WorkoutInput>;
  onSubmit: (input: WorkoutInput) => Promise<void> | void;
  submitLabel?: string;
};

const WORKOUT_TYPES: WorkoutType[] = ['Course', 'Musculation', 'Vélo', 'HIIT', 'Yoga'];
const INTENSITIES: Intensity[] = ['faible', 'moyenne', 'élevée'];

const ACTIVITY_ICONS: Record<WorkoutType, string> = {
  Course: '🏃',
  Musculation: '🏋️',
  Vélo: '🚴',
  HIIT: '⚡',
  Yoga: '🧘',
};

const INTENSITY_COLORS: Record<Intensity, string> = {
  faible: COLORS.status.info,
  moyenne: COLORS.status.warning,
  élevée: COLORS.status.error,
};

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export default function WorkoutForm({ initialValues, onSubmit, submitLabel = 'Ajouter' }: Props) {
  const [type, setType] = useState<WorkoutType | undefined>(initialValues?.type);
  const [durationText, setDurationText] = useState(
    initialValues?.duration != null ? String(initialValues.duration) : ''
  );
  const [intensity, setIntensity] = useState<Intensity | undefined>(initialValues?.intensity);
  const [date, setDate] = useState<Date>(initialValues?.date ?? new Date());
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const duration = useMemo(() => {
    const n = Number(durationText);
    return Number.isFinite(n) ? n : NaN;
  }, [durationText]);

  const validate = () => {
    if (!type) return 'Veuillez sélectionner un type.';
    if (!Number.isFinite(duration) || duration <= 0) return 'Veuillez saisir une durée valide.';
    if (!intensity) return 'Veuillez sélectionner une intensité.';
    if (!date || Number.isNaN(date.getTime())) return 'Veuillez sélectionner une date valide.';
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      Alert.alert('Validation', error);
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
      Alert.alert('Erreur', "Impossible d'ajouter la séance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Type d&apos;activité</Text>
        <View style={styles.typeGrid}>
          {WORKOUT_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, type === t && styles.typeBtnSelected]}
              onPress={() => setType(t)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeBtnIcon}>{ACTIVITY_ICONS[t]}</Text>
              <Text style={[styles.typeBtnLabel, type === t && styles.typeBtnLabelSelected]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Durée (minutes)</Text>
        <TextInput
          value={durationText}
          onChangeText={setDurationText}
          keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })}
          placeholder="ex: 45"
          placeholderTextColor={COLORS.text.tertiary}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Intensité</Text>
        <View style={styles.intensityRow}>
          {INTENSITIES.map((i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.intensityBtn,
                intensity === i && {
                  borderColor: INTENSITY_COLORS[i],
                  backgroundColor: INTENSITY_COLORS[i] + '15',
                },
              ]}
              onPress={() => setIntensity(i)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.intensityBtnText,
                  intensity === i && { color: INTENSITY_COLORS[i] },
                ]}
              >
                {i}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.dateButtonText}>{formatDate(date)}</Text>
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

      <View style={styles.field}>
        <Text style={styles.label}>Notes (optionnel)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Commentaires sur la séance..."
          placeholderTextColor={COLORS.text.tertiary}
          style={[styles.input, styles.textarea]}
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.85}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>{submitting ? '...' : submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  input: {
    height: 46,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.md,
  },
  textarea: {
    height: 110,
    paddingTop: SPACING.md,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  typeBtn: {
    width: '30%',
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  typeBtnSelected: {
    borderColor: COLORS.brand.primary,
    backgroundColor: COLORS.brand.secondary,
  },
  typeBtnIcon: {
    fontSize: 20,
  },
  typeBtnLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  typeBtnLabelSelected: {
    color: COLORS.brand.primary,
  },
  intensityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  intensityBtn: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    backgroundColor: COLORS.background.secondary,
    alignItems: 'center',
  },
  intensityBtnText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  dateButton: {
    height: 46,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background.secondary,
    borderWidth: 1,
    borderColor: COLORS.border.primary,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHT.semibold,
  },
  submitButton: {
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.background.primary,
    fontWeight: FONT_WEIGHT.bold,
    fontSize: FONT_SIZES.md,
  },
});
