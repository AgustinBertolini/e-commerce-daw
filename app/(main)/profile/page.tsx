"use client";

import Cookies from "js-cookie";
import type React from "react";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { updateUserProfile } from "@/lib/user";
import type { UserProfile } from "@/types";
import Pencil from "@/components/icons/Pencil";
import LoadingSpinner from "@/components/LoadingSpinner";

// Extiendo la interfaz para que acepte los campos del backend
interface UserApi {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaActualizacion?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<UserApi | null>(null);
  const [editUser, setEditUser] = useState<UserApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Cookies.get("userId");
        if (!userId) return;
        const userData = await api.usuarios.getById(userId);
        setUser(userData);
        setEditUser(userData); // Inicializa el estado editable
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      await updateUserProfile(profile);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Error al actualizar el perfil" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editUser) return;
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setSaving(true);
      const updated = await updateUserProfile(editUser);
      // Si el backend retorna los campos con nombre/apellido/telefono, usarlos directamente
      const updatedUserApi: UserApi = {
        nombre: (updated as any).nombre ?? updated.name ?? "",
        apellido: (updated as any).apellido ?? updated.lastName ?? "",
        email: updated.email ?? "",
        telefono: ((updated as any).telefono ?? updated.phone ?? "").toString(),
        fechaActualizacion: (updated as any).fechaActualizacion,
      };
      setUser(updatedUserApi);
      setIsEditing(false);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el perfil" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  if (loading) {
    return <LoadingSpinner message="Cargando perfil..." />;
  }

  if (!user) {
    return (
      <div className="container mx-auto py-12 text-center">
        No se pudo cargar la información del usuario.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>
      <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto relative">
        {!isEditing && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsEditing(true)}
            aria-label="Editar perfil"
          >
            <Pencil className="w-5 h-5 text-gray-600" />
          </button>
        )}
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={editUser?.nombre || ""}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={editUser?.apellido || ""}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editUser?.email || ""}
                readOnly
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={editUser?.telefono || ""}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              />
            </div>
            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded transition"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:gap-8">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  {user.nombre} {user.apellido}
                </h2>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Nombre:</span> {user.nombre}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Apellido:</span> {user.apellido}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                {user.telefono && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Teléfono:</span>{" "}
                    {user.telefono}
                  </p>
                )}
                {user.fechaActualizacion && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Última actualización:</span>{" "}
                    {new Date(user.fechaActualizacion).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
