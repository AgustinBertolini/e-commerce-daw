// lib/api.ts
// Objeto API agrupando endpoints por entidad para el serverless especificado

import apiAxios from "./axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/dev";

const api = {
  categorias: {
    getAll: () => apiAxios.get("/api/categorias").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/categorias/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/categorias", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/categorias/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/categorias/${id}`).then((r) => r.data),
  },
  compras: {
    getAll: () => apiAxios.get("/api/compras").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/compras/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/compras", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/compras/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/compras/${id}`).then((r) => r.data),
  },
  favoritos: {
    getAll: () => apiAxios.get("/api/favoritos").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/favoritos/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/favoritos", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/favoritos/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/favoritos/${id}`).then((r) => r.data),
  },
  generos: {
    getAll: () => apiAxios.get("/api/generos").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/generos/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/generos", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/generos/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/generos/${id}`).then((r) => r.data),
  },
  productos: {
    getAll: () => apiAxios.get("/api/productos").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/productos/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/productos", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/productos/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/productos/${id}`).then((r) => r.data),
  },
  usuarios: {
    getAll: () => apiAxios.get("/api/usuarios").then((r) => r.data),
    getById: (id: string) =>
      apiAxios.get(`/api/usuarios/${id}`).then((r) => r.data),
    create: (data: any) =>
      apiAxios.post("/api/usuarios", data).then((r) => r.data),
    update: (id: string, data: any) =>
      apiAxios.put(`/api/usuarios/${id}`, data).then((r) => r.data),
    delete: (id: string) =>
      apiAxios.delete(`/api/usuarios/${id}`).then((r) => r.data),
  },
  chatbot: {
    post: (data: any) =>
      apiAxios.post("/api/chatbot", data).then((r) => r.data),
  },
  ayudaProducto: {
    post: (data: any) =>
      apiAxios.post("/api/chatbot/ayuda-producto", data).then((r) => r.data),
  },
  login: {
    post: (data: any) => apiAxios.post("/api/login", data).then((r) => r.data),
  },
  refreshToken: {
    post: (data: any) =>
      apiAxios.post("/api/refresh-token", data).then((r) => r.data),
  },
  register: {
    post: (data: {
      email: string;
      password: string;
      nombre: string;
      apellido: string;
    }) => apiAxios.post("/api/register", data).then((r) => r.data),
  },
};

export default api;
