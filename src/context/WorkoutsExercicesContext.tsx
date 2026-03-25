import NetInfo from "@react-native-community/netinfo";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  createExercice,
  deleteExercice,
  getAllExercices,
  updateExercice
} from "../services/exerciceService";
import {
  clearSyncedItems,
  enqueueAction,
  getUnsyncedItems,
  markAsSynced,
} from "../storage/syncQueue";
import {
  loadAll as loadWorkouts,
  saveAll as saveWorkouts,
} from "../storage/workoutsStorage";

// ========================
// Types - Unified Workouts
// ========================
export type Intensity = "faible" | "moyenne" | "élevée";
export type WorkoutType = "Course" | "Musculation" | "Vélo" | "Yoga";

export type Workout = {
  id: string;
  type: WorkoutType;
  duration: number;
  intensity: Intensity;
  date: string; // ISO string
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export type WorkoutInput = {
  type: WorkoutType;
  duration: number;
  intensity: Intensity;
  date: Date;
  notes?: string;
};

// ========================
// State & Actions
// ========================
type State = {
  workouts: Workout[];
};

type Action =
  | { type: "HYDRATE"; payload: Workout[] }
  | { type: "ADD_WORKOUT"; payload: Workout }
  | { type: "REMOVE_WORKOUT"; payload: { id: string } };

const initialState: State = {
  workouts: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, workouts: action.payload };
    case "ADD_WORKOUT":
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case "REMOVE_WORKOUT":
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload.id),
      };
    default:
      return state;
  }
}

// ========================
// Context Value Type
// ========================
type WorkoutsContextValue = {
  workouts: Workout[];
  addWorkout: (input: WorkoutInput) => Promise<Workout>;
  removeWorkout: (id: string) => Promise<void>;
  getWorkoutById: (id: string) => Workout | undefined;
  refetch: () => Promise<void>;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isOnline: boolean;
  isSyncing: boolean;
};

const WorkoutsExercicesContext = createContext<
  WorkoutsContextValue | undefined
>(undefined);

// ========================
// Helper Functions
// ========================
function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ========================
// Provider
// ========================
export function WorkoutsExercicesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const hasTriggeredSync = useRef(false);

  // Sync queue to API
  const syncQueue = useCallback(async () => {
    if (isSyncing || hasTriggeredSync.current) return;

    try {
      hasTriggeredSync.current = true;
      setIsSyncing(true);
      const queueItems = await getUnsyncedItems();

      if (queueItems.length === 0) {
        setIsSyncing(false);
        hasTriggeredSync.current = false;
        return;
      }

      console.log(`Syncing ${queueItems.length} queued items...`);

      // Process queue items sequentially with timeout
      const timeoutPerItem = 3000; // 3 seconds per item

      for (const item of queueItems) {
        try {
          // Create promise with timeout
          const syncPromise = (async () => {
            if (item.action === "CREATE" && item.payload) {
              await createExercice(item.payload);
              await markAsSynced(item.id);
            } else if (item.action === "DELETE") {
              await deleteExercice(item.localWorkoutId);
              await markAsSynced(item.id);
            } else if (item.action === "UPDATE" && item.payload) {
              await updateExercice(item.localWorkoutId, item.payload);
              await markAsSynced(item.id);
            }
          })();

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Request timeout")),
              timeoutPerItem,
            ),
          );

          // Race between sync and timeout
          await Promise.race([syncPromise, timeoutPromise]);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.warn(`Failed to sync queue item ${item.id}:`, errorMsg);
          // Continue with next item even if this one fails or times out
        }
      }

      // Clear synced items
      await clearSyncedItems();

      // Fetch fresh data from API
      try {
        const apiWorkouts = (await getAllExercices()) as Workout[];
        dispatch({ type: "HYDRATE", payload: apiWorkouts });
        await saveWorkouts(apiWorkouts);
      } catch (err) {
        console.warn("Failed to fetch after sync", err);
      }

      console.log("Queue sync completed");
    } catch (err) {
      console.warn("Failed to sync queue", err);
    } finally {
      setIsSyncing(false);
      hasTriggeredSync.current = false;
    }
  }, [isSyncing]);

  // Network detection
  useEffect(() => {
    let previousOnlineState = isOnline;

    const unsubscribe = NetInfo.addEventListener((netState) => {
      const online =
        netState.isConnected === true && netState.isInternetReachable === true;

      // Only trigger sync if we transitioned from offline to online
      if (!previousOnlineState && online && !isSyncing) {
        syncQueue();
      }

      previousOnlineState = online;
      setIsOnline(online);
    });

    return () => unsubscribe();
  }, [syncQueue, isSyncing]);

  // Load workouts: first from AsyncStorage, then merge with API data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Load from AsyncStorage first (instant)
        const localWorkouts = await loadWorkouts();
        dispatch({ type: "HYDRATE", payload: localWorkouts });
        setLoading(false); // Show local data immediately

        // 2. Then fetch from API in background
        try {
          const apiWorkouts = (await getAllExercices()) as Workout[];

          // Merge: keep local workouts + add API workouts that don't exist locally
          const localIds = new Set(localWorkouts.map((w) => w.id));
          const newApiWorkouts = apiWorkouts.filter((w) => !localIds.has(w.id));
          const mergedWorkouts = [...localWorkouts, ...newApiWorkouts];

          dispatch({ type: "HYDRATE", payload: mergedWorkouts });

          // Save merged data back to AsyncStorage
          await saveWorkouts(mergedWorkouts);
        } catch (apiError) {
          console.warn(
            "Failed to load workouts from API, using local data only",
            apiError,
          );
          setError("Using offline data");
        }
      } catch (e) {
        console.warn("Failed to load workouts", e);
        setError("Failed to load workouts");
        setLoading(false);
      }
    })();
  }, []);

  // Save workouts to AsyncStorage on every change
  useEffect(() => {
    if (!loading && state.workouts.length > 0) {
      (async () => {
        try {
          await saveWorkouts(state.workouts);
        } catch (e) {
          console.warn("Failed to save workouts", e);
        }
      })();
    }
  }, [state.workouts, loading]);

  const value = useMemo<WorkoutsContextValue>(() => {
    // ========================
    // Workout Functions
    // ========================
    const addWorkout: WorkoutsContextValue["addWorkout"] = async (input) => {
      const nowIso = new Date().toISOString();
      const workout: Workout = {
        id: generateId(),
        type: input.type,
        duration: input.duration,
        intensity: input.intensity,
        date: input.date.toISOString(),
        notes: input.notes?.trim() ? input.notes.trim() : undefined,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Always save locally first
      dispatch({ type: "ADD_WORKOUT", payload: workout });

      // Check network status
      if (isOnline) {
        // If online, try to sync to API immediately
        try {
          await createExercice(workout);
          console.log("Workout synced to API immediately");
        } catch (e) {
          console.warn("Failed to sync workout to API, adding to queue", e);
          // If API call fails, add to queue
          await enqueueAction("CREATE", workout.id, workout);
        }
      } else {
        // If offline, add to queue
        console.log("Offline: Adding workout to sync queue");
        await enqueueAction("CREATE", workout.id, workout);
      }

      return workout;
    };

    const removeWorkout: WorkoutsContextValue["removeWorkout"] = async (id) => {
      // Always remove locally first
      dispatch({ type: "REMOVE_WORKOUT", payload: { id } });

      // Check network status
      if (isOnline) {
        // If online, try to sync to API immediately
        try {
          await deleteExercice(id);
          console.log("Workout deletion synced to API immediately");
        } catch (e) {
          console.warn("Failed to sync deletion to API, adding to queue", e);
          // If API call fails, add to queue
          await enqueueAction("DELETE", id);
        }
      } else {
        // If offline, add to queue
        console.log("Offline: Adding deletion to sync queue");
        await enqueueAction("DELETE", id);
      }
    };

    const getWorkoutById: WorkoutsContextValue["getWorkoutById"] = (id) =>
      state.workouts.find((w) => w.id === id);

    const refetch: WorkoutsContextValue["refetch"] = async () => {
      try {
        setRefreshing(true);
        setError(null);
        const apiWorkouts = (await getAllExercices()) as Workout[];
        dispatch({ type: "HYDRATE", payload: apiWorkouts });
        await saveWorkouts(apiWorkouts);
      } catch (err) {
        setError("Failed to refetch workouts");
        console.warn("Failed to refetch workouts", err);
      } finally {
        setRefreshing(false);
      }
    };

    const sortedWorkouts = [...state.workouts].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });

    return {
      workouts: sortedWorkouts,
      addWorkout,
      removeWorkout,
      getWorkoutById,
      refetch,
      loading,
      refreshing,
      error,
      isOnline,
      isSyncing,
    };
  }, [state.workouts, loading, refreshing, error, isOnline, isSyncing]);

  return (
    <WorkoutsExercicesContext.Provider value={value}>
      {children}
    </WorkoutsExercicesContext.Provider>
  );
}

// ========================
// Hook
// ========================
export function useWorkoutsExercices() {
  const ctx = useContext(WorkoutsExercicesContext);
  if (!ctx) {
    throw new Error(
      "useWorkoutsExercices must be used within a WorkoutsExercicesProvider",
    );
  }
  return ctx;
}
