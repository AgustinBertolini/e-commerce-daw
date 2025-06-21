"use client";

import api from "@/lib/api";
import type { Product } from "@/types";

// Funciones para manipular productos
export async function getAllProducts(): Promise<Product[]> {
  return api.productos.getAll();
}

export async function getRecentProducts(limit = 4): Promise<Product[]> {
  // Ordenar productos por fecha de creación (más recientes primero)
  const allProducts = await api.productos.getAll();
  const recent = allProducts
    .sort(
      (a: Product, b: Product) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return Promise.resolve(recent);
}

export async function getRandomProducts(limit = 10): Promise<Product[]> {
  // Ordenar productos por fecha de creación (más recientes primero)
  const allProducts = await api.productos.getAll();
  const recent = allProducts
    .sort(
      (a: Product, b: Product) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return Promise.resolve(recent);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await api.productos.getById(id);
  } catch {
    return null;
  }
}

export async function getUserProducts(userId = "1"): Promise<Product[]> {
  const allProducts = await api.productos.getAll();
  const products = allProducts.filter((p: Product) => p.userId === userId);

  return Promise.resolve(products);
}

export async function createProduct(productData: any): Promise<Product> {
  // Llama a la API real para crear el producto
  return api.productos.create(productData);
}

export async function updateProduct(productData: any): Promise<Product> {
  // Llama a la API real para actualizar el producto
  return api.productos.update(productData.id, productData);
}

export async function deleteProduct(id: string): Promise<void> {
  // Llama a la API real para eliminar el producto
  await api.productos.delete(id);
}

// Nueva función para buscar productos
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) {
    return getAllProducts();
  }

  const normalizedQuery = query.toLowerCase().trim();

  const allProducts = await api.productos.getAll();

  const results = allProducts.filter((product: Product) => {
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return Promise.resolve(results);
}

// Función para obtener una imagen aleatoria según la categoría
function getRandomImageForCategory(category: string): string {
  const categoryImages: Record<string, string[]> = {
    electronics: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2801&auto=format&fit=crop",
    ],
    clothing: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2940&auto=format&fit=crop",
    ],
    home: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2940&auto=format&fit=crop",
    ],
    books: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2874&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2940&auto=format&fit=crop",
    ],
    sports: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2835&auto=format&fit=crop",
    ],
    toys: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2942&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b40?q=80&w=2940&auto=format&fit=crop",
    ],
  };

  const defaultImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2799&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2940&auto=format&fit=crop",
  ];

  const images = categoryImages[category] || defaultImages;
  return images[Math.floor(Math.random() * images.length)];
}
