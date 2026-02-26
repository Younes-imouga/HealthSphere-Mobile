import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../navigation/AppNavigator';
import WorkoutListItem from '../components/WorkoutListItem';
import { useWorkouts } from '../context/WorkoutsContext';
import type { Workout } from '../context/WorkoutsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { workouts } = useWorkouts();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      <FlatList
        data={workouts}
        keyExtractor={(item: Workout) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.title}>
                Votre <Text style={styles.titleAccent}>Dashboard</Text>
              </Text>
            </View>

            <View style={styles.statsRow}>
              {[
                { val: '5', lbl: 'Séances' },
                { val: '275', lbl: 'Minutes' },
                { val: '3', lbl: 'Cette semaine' },
              ].map((s) => (
                <View key={s.lbl} style={styles.statPill}>
                  <Text style={styles.statVal}>{s.val}</Text>
                  <Text style={styles.statLbl}>{s.lbl}</Text>
                </View>
              ))}
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLbl}>Objectif hebdomadaire</Text>
                <Text style={[styles.progressVal, { color: '#00E5A0' }]}>3 / 4 séances</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '75%', backgroundColor: '#00E5A0' }]} />
              </View>

              <View style={styles.progressRow}>
                <Text style={styles.progressLbl}>Durée totale</Text>
                <Text style={[styles.progressVal, { color: '#4D9EFF' }]}>275 / 300 min</Text>
              </View>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: '92%', backgroundColor: '#4D9EFF' }]} />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dernières séances</Text>
          </>
        }
        renderItem={({ item }: { item: Workout }) => (
          <WorkoutListItem workout={item} onPress={() => navigation.navigate('WorkoutDetails', { id: item.id })} />
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddWorkout')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0C10' },
  list: { paddingTop: 8, paddingBottom: 24 },

  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 4 },
  greeting: { fontSize: 13, color: '#7A7F8E', fontWeight: '300', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', color: '#F0F2F7', letterSpacing: -0.5 },
  titleAccent: { color: '#00E5A0' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 24, paddingTop: 20, gap: 10 },
  statPill: {
    flex: 1,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statVal: { fontSize: 22, fontWeight: '700', color: '#00E5A0', letterSpacing: -0.5 },
  statLbl: {
    fontSize: 9,
    color: '#7A7F8E',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 3,
  },

  progressSection: { paddingHorizontal: 24, paddingTop: 20 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLbl: { fontSize: 11, color: '#7A7F8E' },
  progressVal: { fontSize: 11, fontWeight: '600' },
  barBg: {
    height: 4,
    backgroundColor: '#1A1D24',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barFill: { height: '100%', borderRadius: 2 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7A7F8E',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },

  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#00E5A0',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5A0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabText: { fontSize: 28, fontWeight: '300', color: '#0A0C10', lineHeight: 32 },
});
