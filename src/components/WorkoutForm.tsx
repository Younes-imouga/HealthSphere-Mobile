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
import { Picker } from '@react-native-picker/picker';

import type { Intensity, WorkoutInput, WorkoutType } from '../context/WorkoutsContext';

type Props = {
  initialValues?: Partial<WorkoutInput>;
  onSubmit: (input: WorkoutInput) => Promise<void> | void;
  submitLabel?: string;
};

const WORKOUT_TYPES: WorkoutType[] = ['Course', 'Musculation', 'Vélo', 'HIIT', 'Yoga'];
const INTENSITIES: Intensity[] = ['faible', 'moyenne', 'élevée'];

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
        <Text style={styles.label}>Type</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={type}
            onValueChange={(v: WorkoutType | undefined) => setType(v)}
            dropdownIconColor="#F0F2F7"
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner..." value={undefined} />
            {WORKOUT_TYPES.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Durée (minutes)</Text>
        <TextInput
          value={durationText}
          onChangeText={setDurationText}
          keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric', default: 'numeric' })}
          placeholder="Ex: 45"
          placeholderTextColor="#3D4150"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Intensité</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={intensity}
            onValueChange={(v: Intensity | undefined) => setIntensity(v)}
            dropdownIconColor="#F0F2F7"
            style={styles.picker}
          >
            <Picker.Item label="Sélectionner..." value={undefined} />
            {INTENSITIES.map((i) => (
              <Picker.Item key={i} label={i} value={i} />
            ))}
          </Picker>
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
          placeholder="Notes..."
          placeholderTextColor="#3D4150"
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
    padding: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    color: '#7A7F8E',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    color: '#F0F2F7',
  },
  textarea: {
    height: 110,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  pickerWrap: {
    borderRadius: 14,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    overflow: 'hidden',
  },
  picker: {
    color: '#F0F2F7',
  },
  dateButton: {
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#F0F2F7',
    fontWeight: '600',
  },
  submitButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#00E5A0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#0A0C10',
    fontWeight: '800',
  },
});
