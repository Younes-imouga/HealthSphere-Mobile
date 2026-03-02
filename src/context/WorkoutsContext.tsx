import React, { createContext, useContext, useMemo, useReducer, useEffect, useState } from 'react';

import { loadAll, saveAll } from '../storage/workoutsStorage';

export type Intensity = 'faible' | 'moyenne' | 'élevée';

export type WorkoutType = 'Course' | 'Musculation' | 'Vélo' | 'Yoga';

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

type State = {
  workouts: Workout[];
};

type Action =
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'REMOVE_WORKOUT'; payload: { id: string } }
  | { type: 'HYDRATE'; payload: Workout[] };

const initialState: State = {
  workouts: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, workouts: action.payload };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'REMOVE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter((w) => w.id !== action.payload.id),
      };
    default:
      return state;
  }
}

type WorkoutsContextValue = {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (input: WorkoutInput) => Promise<Workout>;
  removeWorkout: (id: string) => Promise<void>;
  getWorkoutById: (id: string) => Workout | undefined;
};

const WorkoutsContext = createContext<WorkoutsContextValue | undefined>(undefined);

function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const loaded = await loadAll();
        dispatch({ type: 'HYDRATE', payload: loaded });
      } catch (e) {
        console.warn('Failed to load workouts', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save to storage on every change
  useEffect(() => {
    if (!loading) {
      (async () => {
        try {
          await saveAll(state.workouts);
        } catch (e) {
          console.warn('Failed to save workouts', e);
        }
      })();
    }
  }, [state.workouts, loading]);

  const value = useMemo<WorkoutsContextValue>(() => {
    const addWorkout: WorkoutsContextValue['addWorkout'] = async (input) => {
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

      dispatch({ type: 'ADD_WORKOUT', payload: workout });
      return workout;
    };

    const removeWorkout: WorkoutsContextValue['removeWorkout'] = async (id) => {
      dispatch({ type: 'REMOVE_WORKOUT', payload: { id } });
    };

    const getWorkoutById: WorkoutsContextValue['getWorkoutById'] = (id) =>
      state.workouts.find((w) => w.id === id);

    const workouts = [...state.workouts].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });

    return {
      workouts,
      loading,
      addWorkout,
      removeWorkout,
      getWorkoutById,
    };
  }, [state.workouts, loading]);

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
}

export function useWorkouts() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) {
    throw new Error('useWorkouts must be used within a WorkoutsProvider');
  }
  return ctx;
}
