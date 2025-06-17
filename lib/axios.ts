import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken, logoutUser } from "./auth";

const apiAxios = axios.create({
  baseURL: "http://localhost:3000/dev",
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
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/refresh-token")
    ) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiAxios(originalRequest);
      } else {
        await logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

export default apiAxios;
