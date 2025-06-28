"use client";

import type React from "react";
import { use } from "react";

import { useState, useEffect } from "react";
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
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

// Defino el tipo para el producto según el payload del endpoint
interface ProductApi {
  _id: string;
  categoria: string | { _id: string; nombre: string };
  usuario:
    | string
    | { _id: string; nombre: string; apellido: string; email: string };
  genero?: string | { _id: string; nombre: string };
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  fechaActualizacion: string;
  image?: string;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [categorias, setCategorias] = useState<
    { _id: string; nombre: string }[]
  >([]);
  const [generos, setGeneros] = useState<{ _id: string; nombre: string }[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    genero: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    // Carga producto, categorías y géneros
    const loadProduct = async () => {
      try {
        const [productData, apiCategorias, apiGeneros] = await Promise.all([
          api.productos.getById(id),
          api.categorias.getAll(),
          api.generos.getAll(),
        ]);
        setProduct(productData);
        setCategorias(apiCategorias);
        setGeneros(apiGeneros);
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    // Inicializa el formData solo una vez cuando product esté disponible
    if (product && !formInitialized) {
      setFormData({
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        precio: product.precio?.toString() || "",
        stock: product.stock?.toString() || "",
        categoria:
          typeof product.categoria === "object"
            ? product.categoria._id
            : product.categoria || "",
        genero:
          product.genero && typeof product.genero === "object"
            ? product.genero._id
            : product.genero || "",
        image: product.image || "",
      });
      setFormInitialized(true);
    }
  }, [product, formInitialized]);

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

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = Number(value.replace(/[^\d]/g, ""));
    if (isNaN(number)) return value;
    return number.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (
      !formData.nombre ||
      !formData.descripcion ||
      !formData.precio ||
      !formData.stock ||
      !formData.categoria
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
      setSaving(true);
      const productData = {
        ...formData,
        precio,
        stock,
        genero: formData.genero || null,
      };
      await api.productos.update(id, productData);
      router.push("/admin/products");
    } catch (err) {
      setError(
        "Error al actualizar el producto. Por favor intenta nuevamente."
      );
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando producto..." />;
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Button onClick={() => router.push("/admin/products")}>
          Volver a Productos
        </Button>
      </div>
    );
  }

  if (!formInitialized) {
    return (
      <div className="container mx-auto py-12 text-center">
        Cargando formulario...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Producto *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría *</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  handleSelectChange("categoria", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.nombre}
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
                type="text"
                inputMode="numeric"
                value={formatCurrency(formData.precio)}
                onChange={(e) => {
                  // Solo permitir números
                  const raw = e.target.value.replace(/[^\d]/g, "");
                  setFormData({ ...formData, precio: raw });
                }}
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
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => handleSelectChange("genero", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un género (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {generos.map((gen) => (
                    <SelectItem key={gen._id} value={gen._id}>
                      {gen.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={5}
                maxLength={500}
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
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
