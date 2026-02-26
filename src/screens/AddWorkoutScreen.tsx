import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkouts } from '../context/WorkoutsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWorkout'>;

export default function AddWorkoutScreen({ navigation }: Props) {
  const { addWorkout } = useWorkouts();

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <WorkoutForm
            submitLabel="Ajouter"
            onSubmit={async (input) => {
              try {
                await addWorkout(input);
                navigation.navigate('Home');
              } catch {
                Alert.alert('Erreur', "Impossible d'ajouter la séance.");
              }
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0A0C10',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingVertical: 12,
  },
});
