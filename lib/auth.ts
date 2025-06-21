import api from "./api";
import Cookies from "js-cookie";

export async function login(email: string, password: string) {
  const data = await api.login.post({ email, password });
  // Se asume que api.login.post retorna el objeto de respuesta y el status está en data.status o similar
  // Si necesitas el status HTTP, deberías modificar api.ts para retornar { status, data }
  if (data && (data.status === 200 || data.status === 201 || data.token)) {
    if (data.token && data.userId) {
      Cookies.set("token", data.token, { path: "/" });
      Cookies.set("userId", data.userId, { path: "/" });
    }
    return data;
  } else {
    throw new Error(data.message || "Login failed");
  }
}

export async function refreshToken() {
  const token = Cookies.get("token");
  if (!token) return null;
  const data = await api.refreshToken.post({ token });
  if (data && data.token) {
    Cookies.set("token", data.token, { path: "/" });
    return data.token;
  }
  return null;
}

export async function logoutUser() {
  Cookies.remove("sessionExpiry", { path: "/" });
  Cookies.remove("token", { path: "/" });
  Cookies.remove("userId", { path: "/" });
}

export function getCurrentUserId(): string | null {
  return Cookies.get("userId") || null;
}

export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const data = await api.register.post({
    email,
    password,
    nombre: firstName,
    apellido: lastName,
  });

  console.log("Register response:", data);
  if (data && data.token && data.userId) {
    Cookies.set("token", data.token, { path: "/" });
    Cookies.set("userId", data.userId, { path: "/" });
  }
  return data;
}
