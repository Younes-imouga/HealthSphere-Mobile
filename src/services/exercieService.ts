import {api} from './api';

export const getAllExercices = async () =>{
    const res = await api.get("/exercice");
    return res.data;
}

export const createExercice = async (payload) =>{
    const res = await api.post("/exercice", payload);
    return res.data;
}