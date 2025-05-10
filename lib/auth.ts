import type { UserProfile } from "@/types";

// Almacenamiento local para simular una base de datos
const users = [
  {
    id: "1",
    email: "admin@admin.com",
    password: "admin",
    name: "Administrador",
    lastName: "Sistema",
    phone: "123456789",
    addresses: [
      {
        street: "Calle Principal 123",
        city: "Ciudad Ejemplo",
        postalCode: "12345",
      },
    ],
  },
];

// Simula el usuario actual
let currentUser: UserProfile | null = null;

// Duración de la sesión en milisegundos (5 minutos)
const SESSION_DURATION = 60 * 60 * 1000;

// Control de intentos fallidos
let failedAttempts = 0;
let lockoutUntil = 0;
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 60 * 1000; // 1 minuto en milisegundos

export async function registerUser(
  email: string,
  password: string
): Promise<void> {
  // Verificar si el usuario ya existe
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("El usuario ya existe");
  }

  // Crear nuevo usuario
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password,
    name: "",
    lastName: "",
    phone: "",
    addresses: [],
  };

  users.push(newUser);

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Promise.resolve();
}

export async function loginUser(
  email: string,
  password: string
): Promise<void> {
  // Verificar si la cuenta está bloqueada
  if (isAccountLocked()) {
    const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000);
    throw new Error(
      `Cuenta bloqueada temporalmente. Intente nuevamente en ${remainingTime} segundos.`
    );
  }

  // Buscar usuario
  const user = users.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    // Incrementar contador de intentos fallidos
    failedAttempts++;

    // Si alcanza el máximo de intentos, bloquear la cuenta
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION;
      throw new Error(
        `Demasiados intentos fallidos. Cuenta bloqueada por 1 minuto.`
      );
    }

    throw new Error(
      `Credenciales inválidas. Intentos restantes: ${
        MAX_FAILED_ATTEMPTS - failedAttempts
      }`
    );
  }

  // Restablecer contador de intentos fallidos
  failedAttempts = 0;
  lockoutUntil = 0;

  // Establecer usuario actual
  currentUser = { ...user };

  // Establecer cookie de sesión (en cliente)
  document.cookie = `sessionExpiry=${Date.now() + SESSION_DURATION}; path=/`;

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Promise.resolve();
}

export async function logoutUser(): Promise<void> {
  currentUser = null;

  // Eliminar cookie de sesión (en cliente)
  document.cookie =
    "sessionExpiry=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  return Promise.resolve();
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  // En una aplicación real, esto verificaría el token de sesión

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  return Promise.resolve(currentUser);
}

export function isSessionValid(): boolean {
  // Verificar si la sesión ha expirado
  try {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const expiryTime = Number.parseInt(cookies.sessionExpiry || "0", 10);
    return expiryTime > Date.now();
  } catch (error) {
    return false;
  }
}

export function isAccountLocked(): boolean {
  return lockoutUntil > Date.now();
}

export function getRemainingLockoutTime(): number {
  if (!isAccountLocked()) return 0;
  return Math.ceil((lockoutUntil - Date.now()) / 1000);
}

export function getFailedAttempts(): number {
  return failedAttempts;
}

// Para fines de demostración, inicializar con un usuario
// currentUser = users[0]
