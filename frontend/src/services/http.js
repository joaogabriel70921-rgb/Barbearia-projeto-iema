import axios from "axios";

// Cliente HTTP único da aplicação.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Injeta o token JWT em toda requisição.
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resposta: devolve o envelope { success, message, data } e normaliza erros.
http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
    }
    const body = error.response?.data;
    return Promise.reject(
      Object.assign(new Error(body?.message || "Erro na requisição"), {
        status: error.response?.status,
        fields: body?.fields,
      })
    );
  }
);
