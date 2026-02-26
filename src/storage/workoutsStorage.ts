import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Workout } from '../context/WorkoutsContext';

const STORAGE_KEY = 'health-sphere-workouts';

export async function saveAll(workouts: Workout[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch (error) {
    console.error('Failed to save workouts to AsyncStorage', error);
    throw error;
  }
}

export async function loadAll(): Promise<Workout[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Workout[] = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.error('Failed to load workouts from AsyncStorage', error);
    return [];
  }
}

export async function removeById(id: string): Promise<Workout[]> {
  try {
    const current = await loadAll();
    const filtered = current.filter((w) => w.id !== id);
    await saveAll(filtered);
    return filtered;
  } catch (error) {
    console.error('Failed to remove workout by id', error);
    throw error;
  }
}
