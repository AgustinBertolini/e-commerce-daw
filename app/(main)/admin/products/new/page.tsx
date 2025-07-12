"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createProduct } from "@/lib/products";
import api from "@/lib/api";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    precio: "",
    stock: "",
    category: "",
    gender: "",
    image: "",
    imagenBase64: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    []
  );
  const [genders, setGenders] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      const cats = await api.categorias.getAll();
      setCategories(
        cats.map((cat: any) => ({
          id: cat._id || cat.id,
          label: cat.nombre || cat.label || cat.name,
        }))
      );
      const gens = await api.generos.getAll();
      setGenders(
        gens.map((gen: any) => ({
          id: gen._id || gen.id,
          label: gen.nombre || gen.label || gen.name,
        }))
      );
    };
    fetchFilters();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (
      !formData.name ||
      !formData.description ||
      !formData.precio ||
      !formData.stock ||
      !formData.category ||
      !formData.imagenBase64
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    const precio = Number.parseFloat(formData.precio);
    const stock = Number.parseInt(formData.stock);

    if (isNaN(precio) || precio <= 0) {
      setError("El precio debe ser un número mayor a 0");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      setError("El stock debe ser un número mayor o igual a 0");
      return;
    }

    try {
      setLoading(true);
      const productData = {
        nombre: formData.name,
        descripcion: formData.description,
        precio,
        stock,
        categoria: formData.category,
        genero: formData.gender || null,
        imagenBase64: formData.imagenBase64,
      };
      await createProduct(productData);
      router.push("/admin/products");
    } catch (err) {
      setError("Error al crear el producto. Por favor intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio *</Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un género (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gen) => (
                    <SelectItem key={gen.id} value={gen.id}>
                      {gen.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagen *</Label>
              <div className="flex items-center gap-2">
                {formData.imagenBase64 && (
                  <div className="flex-shrink-0">
                    <img
                      src={formData.imagenBase64}
                      alt="Previsualización"
                      className="max-h-32 w-auto rounded shadow"
                      style={{ maxWidth: 120 }}
                    />
                  </div>
                )}
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({
                          ...prev,
                          imagenBase64: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  required
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
