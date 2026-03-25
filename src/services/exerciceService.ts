import type { Workout, WorkoutInput } from '../context/WorkoutsExercicesContext';
import { api } from './api';

export const getAllExercices = async () =>{
    const res = await api.get("/exercises");
    console.log("response", res.data);
    return res.data;
}

export const createExercice = async (data: Workout | WorkoutInput) =>{
    const res = await api.post("/exercises", data);
    return res.data;
}

export const getExerciceById =  async (id: string) => {
    const res = await api.get(`/exercises/${id}`);
    return res.data;
}

export const updateExercice = async (id: string, data: Workout | WorkoutInput) => {
    const res = await api.put(`/exercises/${id}`, data);
    return res.data;
}

export const deleteExercice = async (id: string) => {
    const res = await api.delete(`/exercises/${id}`);
    return res.data;
}