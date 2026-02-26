import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';
import { useWorkouts } from '../context/WorkoutsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutDetails'>;

export default function WorkoutDetailsScreen({ route, navigation }: Props) {
  const { getWorkoutById, removeWorkout } = useWorkouts();
  const workout = getWorkoutById(route.params.id);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Séance introuvable</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{workout.type}</Text>
        <Text style={styles.subtitle}>{new Date(workout.date).toLocaleDateString()}</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Durée</Text>
            <Text style={styles.value}>{workout.duration} min</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Intensité</Text>
            <Text style={styles.value}>{workout.intensity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{workout.notes ?? '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Créé</Text>
            <Text style={styles.value}>{new Date(workout.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mis à jour</Text>
            <Text style={styles.value}>{new Date(workout.updatedAt).toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
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
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  content: {
    padding: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#0A0C10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#F0F2F7', marginBottom: 6 },
  subtitle: { fontSize: 13, color: '#7A7F8E', marginBottom: 16 },
  card: {
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  label: { color: '#7A7F8E', fontSize: 12, fontWeight: '600' },
  value: { color: '#F0F2F7', fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'right' },
  button: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#F0F2F7', fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#FF4D4D20',
    borderColor: '#FF4D4D50',
  },
  deleteButtonText: {
    color: '#FF4D4D',
    fontWeight: '800',
  },
});
