import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkouts } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWorkout'>;

export default function AddWorkoutScreen({ navigation }: Props) {
  const { addWorkout } = useWorkouts();

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle séance</Text>
        <Text style={styles.subtitle}>Enregistrez votre activité</Text>
      </View>
      
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', default: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <WorkoutForm
            submitLabel="✓ Enregistrer la séance"
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
    backgroundColor: COLORS.background.primary,
  },
  header: {
    paddingTop: SPACING.xl + SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    marginBottom: SPACING.md,
  },
  backBtnText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
  },
});
