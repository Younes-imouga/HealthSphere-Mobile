import {api} from './api';

export const getAllExercices = async () =>{
    const res = await api.get("/exercises");
    console.log("responssse", res.data);
    return res.data;
}

export const createExercice = async (data) =>{
    const res = await api.post("/exercises", data);
    return res.data;
}

export const getExerciceById =  async (id: string) => {
    const res = await api.get(`/exercises/${id}`);
    return res.data;
}