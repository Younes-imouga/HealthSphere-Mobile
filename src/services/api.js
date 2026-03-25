import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://lzw88036-3333.uks1.devtunnels.ms",
});
