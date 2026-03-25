import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { getAllExercices } from "../services/exerciceService";

export type Exercice = {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  duration: number;
};

type State = {
  exercices: Exercice[];
};

type Action = { type: "HYDRATE"; payload: Exercice[] };

const initialState: State = {
  exercices: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, exercices: action.payload };
    default:
      return state;
  }
}

type ExercicesContextValue = {
  exercices: Exercice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getExerciceById: (id: string) => Exercice | undefined;
};

const ExercicesContext = createContext<ExercicesContextValue | undefined>(
  undefined,
);

export function ExercicesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = (await getAllExercices()) as Exercice[];
      dispatch({ type: "HYDRATE", payload: data });
    } catch {
      setError("Failed to load exercices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchExercices();
  }, []);

  const value = useMemo<ExercicesContextValue>(() => {
    const getExerciceById: ExercicesContextValue["getExerciceById"] = (id) =>
      state.exercices.find((exercice) => exercice.id === id);

    const refetch: ExercicesContextValue["refetch"] = async () => {
      await fetchExercices();
    };

    return {
      exercices: state.exercices,
      loading,
      error,
      refetch,
      getExerciceById,
    };
  }, [state.exercices, loading, error]);

  return (
    <ExercicesContext.Provider value={value}>
      {children}
    </ExercicesContext.Provider>
  );
}

export function useExercices() {
  const ctx = useContext(ExercicesContext);
  if (!ctx) {
    throw new Error("useExercices must be used within an ExercicesProvider");
  }
  return ctx;
}
