import React, { createContext, useContext, useMemo, useReducer } from 'react';

export type Intensity = 'faible' | 'moyenne' | 'élevée';

export type WorkoutType = 'Course' | 'Musculation' | 'Vélo' | 'HIIT' | 'Yoga';

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
  | { type: 'REMOVE_WORKOUT'; payload: { id: string } };

const initialState: State = {
  workouts: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
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
      addWorkout,
      removeWorkout,
      getWorkoutById,
    };
  }, [state.workouts]);

  return <WorkoutsContext.Provider value={value}>{children}</WorkoutsContext.Provider>;
}

export function useWorkouts() {
  const ctx = useContext(WorkoutsContext);
  if (!ctx) {
    throw new Error('useWorkouts must be used within a WorkoutsProvider');
  }
  return ctx;
}
