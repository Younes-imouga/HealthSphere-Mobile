import React, { createContext, useContext, useEffect, useState, } from "react";
import { getAllExercices } from "../services/exerciceService";

export type exercice = {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  description: string;
  duration: number;
};

type ExercicesContextType = {
  exercices: exercice[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const ExercicesContext = createContext<ExercicesContextType | undefined>(
  undefined
);

export const ExercicesProvider = ({ children }: { children: React.ReactNode }) => {
  const [exercices, setexercices] = useState<exercice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchexercices = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllExercices();
      setexercices(data);
    } catch (err) {
      setError("Failed to load exercices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchexercices();
  }, []);
  console.log("exerccccccic", exercices);

  return (
    <ExercicesContext.Provider
      value={{ exercices, loading, error, refetch: fetchexercices }}
    >
      {children}
    </ExercicesContext.Provider>
  );
};

export const useExercices = () => {
  const context = useContext(ExercicesContext);

  if (!context) {
    throw new Error("useExercices must be used within exercicesProvider");
  }

  return context;
};