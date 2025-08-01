import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken, logoutUser } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Interceptor para agregar el token a cada request
apiAxios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiAxios.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;
    // Si el error es 401 y no es el endpoint de refresh-token y no se ha reintentado
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        let newToken = null;
        try {
          newToken = await refreshToken();
        } catch (e) {
          // Si refreshToken lanza error, forzar logout
          await logoutUser();
          return Promise.reject(error);
        }
        if (newToken) {
          Cookies.set("token", newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiAxios(originalRequest);
        } else {
          await logoutUser();
          return Promise.reject(error);
        }
      } catch (e) {
        await logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

export default apiAxios;
