"use client";

import Cookies from "js-cookie";
import type React from "react";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { updateUserProfile } from "@/lib/user";
import type { UserProfile } from "@/types";

// Extiendo la interfaz para que acepte los campos del backend
interface UserApi {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: number;
  fechaActualizacion?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<UserApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = Cookies.get("userId");
        if (!userId) return;
        const userData = await api.usuarios.getById(userId);
        setUser(userData);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;

    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        Cargando perfil...
      </div>
    );
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
      <div className="bg-white rounded-lg shadow-md p-8 max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {user.telefono && (
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Teléfono:</span> {user.telefono}
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
      </div>
    </div>
  );
}
