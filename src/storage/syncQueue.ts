import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Workout } from '../context/WorkoutsExercicesContext';

const QUEUE_STORAGE_KEY = '@healthsphere:sync_queue';

export type QueueAction = 'CREATE' | 'DELETE' | 'UPDATE';

export type QueueItem = {
  id: string;
  timestamp: number;
  action: QueueAction;
  localWorkoutId: string;
  payload?: Workout;
  synced: boolean;
};

// Generate unique queue item ID
function generateQueueId(): string {
  return `queue_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Load queue from AsyncStorage
export async function loadQueue(): Promise<QueueItem[]> {
  try {
    const data = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to load sync queue', e);
    return [];
  }
}

// Save queue to AsyncStorage
export async function saveQueue(queue: QueueItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to save sync queue', e);
  }
}

// Add item to queue
export async function enqueueAction(
  action: QueueAction,
  localWorkoutId: string,
  payload?: Workout
): Promise<void> {
  const queue = await loadQueue();
  const item: QueueItem = {
    id: generateQueueId(),
    timestamp: Date.now(),
    action,
    localWorkoutId,
    payload,
    synced: false,
  };
  queue.push(item);
  await saveQueue(queue);
}

// Remove synced items from queue
export async function clearSyncedItems(): Promise<void> {
  const queue = await loadQueue();
  const unsyncedItems = queue.filter(item => !item.synced);
  await saveQueue(unsyncedItems);
}

// Mark item as synced
export async function markAsSynced(queueItemId: string): Promise<void> {
  const queue = await loadQueue();
  const item = queue.find(q => q.id === queueItemId);
  if (item) {
    item.synced = true;
    await saveQueue(queue);
  }
}

// Get unsynced items
export async function getUnsyncedItems(): Promise<QueueItem[]> {
  const queue = await loadQueue();
  return queue.filter(item => !item.synced);
}

// Clear entire queue (use with caution)
export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear sync queue', e);
  }
}
