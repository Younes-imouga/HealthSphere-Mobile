import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AddWorkout'>;

export default function AddWorkoutScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AddWorkout</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0C10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#F0F2F7', marginBottom: 16 },
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
});
