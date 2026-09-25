import axios from "axios";
import { camelizeKeys, snakeifyKeys } from "@/lib/caseUtils";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // útil si tu API usa cookies/sesiones
});

// Interceptor de requests (añade el token JWT y convierte el body a snake_case)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // No tocar FormData (subida de archivos) ni bodies vacíos/no-objeto.
  if (
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData)
  ) {
    config.data = snakeifyKeys(config.data);
  }

  return config;
});

// Interceptor de responses (convierte a camelCase y maneja errores globales)
api.interceptors.response.use(
  (response) => {
    // No tocar blobs (descargas de archivos) ni respuestas no-objeto.
    if (
      response.data &&
      typeof response.data === "object" &&
      !(response.data instanceof Blob)
    ) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
