"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

// Defino el tipo para el producto según el payload del endpoint
interface ProductApi {
  _id: string;
  categoria: string;
  usuario: string;
  genero: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  fechaActualizacion: string;
  image?: string;
}

interface CategoriaApi {
  _id: string;
  nombre: string;
}
interface GeneroApi {
  _id: string;
  nombre: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [categorias, setCategorias] = useState<CategoriaApi[]>([]);
  const [generos, setGeneros] = useState<GeneroApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [apiProducts, apiCategorias, apiGeneros] = await Promise.all([
          api.productos.getAll(),
          api.categorias.getAll(),
          api.generos.getAll(),
        ]);
        setProducts(apiProducts);
        setCategorias(apiCategorias);
        setGeneros(apiGeneros);
      } catch (error) {
        console.error("Error loading products/categorias/generos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await api.productos.delete(productId);
        setProducts(products.filter((product) => product._id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      (product.nombre?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (product.categoria?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  if (loading) {
    return <LoadingSpinner message="Cargando productos..." />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Administrar Productos</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Imagen</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Género</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Image
                        src={
                          product.image || "/placeholder.svg?height=40&width=40"
                        }
                        alt={product.nombre || "N/A"}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.nombre || "N/A"}
                    </TableCell>
                    <TableCell>
                      {categorias.find((c) => c._id === product.categoria)
                        ?.nombre || "N/A"}
                    </TableCell>
                    <TableCell>
                      {generos.find((g) => g._id === product.genero)?.nombre ||
                        "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.precio?.toLocaleString("es-AR") ?? "N/A"}
                    </TableCell>
                    <TableCell>{product.stock ?? "N/A"}</TableCell>
                    <TableCell>
                      {product.stock > 0 ? (
                        <Badge className="bg-green-500">Disponible</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-500 border-red-500"
                        >
                          Agotado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/products/edit/${product._id}`}>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
