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

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Intensity = 'faible' | 'moyenne' | 'élevée';

type Workout = {
  id: string;
  type: string;
  icon: string;
  duration: number;
  intensity: Intensity;
  date: string;
};

const WORKOUTS: Workout[] = [
  { id: '1', type: 'Course', icon: '🏃', duration: 45, intensity: 'élevée', date: '23 fév' },
  { id: '2', type: 'Musculation', icon: '🏋️', duration: 60, intensity: 'moyenne', date: '21 fév' },
  { id: '3', type: 'Vélo', icon: '🚴', duration: 90, intensity: 'faible', date: '19 fév' },
  { id: '4', type: 'HIIT', icon: '⚡', duration: 30, intensity: 'élevée', date: '17 fév' },
  { id: '5', type: 'Yoga', icon: '🧘', duration: 50, intensity: 'faible', date: '15 fév' },
];

const INTENSITY_COLOR: Record<Intensity, string> = {
  faible: '#4D9EFF',
  moyenne: '#FFB800',
  élevée: '#FF6B35',
};

function WorkoutCard({
  item,
  onPress,
}: {
  item: Workout;
  onPress: () => void;
}) {
  const color = INTENSITY_COLOR[item.intensity];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardIconText}>{item.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardType}>{item.type}</Text>
        <View style={styles.cardChips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {item.duration} min</Text>
          </View>
          <View style={[styles.chip, { borderColor: color + '50' }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.chipText, { color }]}>{item.intensity}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.cardDate}>{item.date}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0C10" />

      <FlatList
        data={WORKOUTS}
        keyExtractor={(item) => item.id}
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
        renderItem={({ item }) => (
          <WorkoutCard
            item={item}
            onPress={() => navigation.navigate('WorkoutDetails', { id: item.id })}
          />
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

  card: {
    marginHorizontal: 24,
    marginBottom: 10,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cardIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#00E5A010',
    borderWidth: 1,
    borderColor: '#00E5A020',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconText: { fontSize: 22 },
  cardBody: { flex: 1 },
  cardType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F2F7',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  cardChips: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1D24',
    borderWidth: 1,
    borderColor: '#222530',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipText: { fontSize: 10, fontWeight: '500', color: '#7A7F8E' },
  dot: { width: 5, height: 5, borderRadius: 3 },
  cardDate: { fontSize: 10, color: '#3D4150' },

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
