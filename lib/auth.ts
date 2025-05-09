// Simulación de autenticación para fines de demostración
// En una aplicación real, esto se conectaría a un backend o servicio de autenticación

import type { UserProfile } from "@/types"

// Almacenamiento local para simular una base de datos
const users = [
  {
    id: "1",
    email: "usuario@ejemplo.com",
    password: "password123",
    name: "Usuario",
    lastName: "Ejemplo",
    phone: "123456789",
    addresses: [
      {
        street: "Calle Principal 123",
        city: "Ciudad Ejemplo",
        postalCode: "12345",
      },
    ],
  },
]

// Simula el usuario actual
let currentUser: UserProfile | null = null

export async function registerUser(email: string, password: string): Promise<void> {
  // Verificar si el usuario ya existe
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    throw new Error("El usuario ya existe")
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
  }

  users.push(newUser)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve()
}

export async function loginUser(email: string, password: string): Promise<void> {
  // Buscar usuario
  const user = users.find((user) => user.email === email && user.password === password)
  if (!user) {
    throw new Error("Credenciales inválidas")
  }

  // Establecer usuario actual
  currentUser = { ...user }

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve()
}

export async function logoutUser(): Promise<void> {
  currentUser = null

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve()
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  // En una aplicación real, esto verificaría el token de sesión

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(currentUser)
}

// Para fines de demostración, inicializar con un usuario
currentUser = users[0]
