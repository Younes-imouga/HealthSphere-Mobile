import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, TouchableOpacity, Text, StatusBar } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../navigation/AppNavigator';
import WorkoutForm from '../components/WorkoutForm';
import { useWorkouts } from '../context/WorkoutsContext';
import { COLORS, FONT_SIZES, FONT_WEIGHT, SPACING } from '../theme/constants';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWorkout'>;

export default function AddWorkoutScreen({ navigation }: Props) {
  const { addWorkout } = useWorkouts();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.backBtnText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nouvelle séance</Text>
          <Text style={styles.subtitle}>Enregistrez votre activité</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  backBtn: {
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.brand.primary,
    fontWeight: FONT_WEIGHT.bold,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
});
