"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import ProductFilters, {
  type ProductFilters as FilterOptions,
} from "@/components/product-filters";
import { searchProducts } from "@/lib/products";
import type { Product } from "@/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const results = await searchProducts(query);
        setAllProducts(results);
        setFilteredProducts(results);

        // Determinar el precio máximo para el filtro
        const highestPrice = Math.ceil(
          Math.max(...results.map((product) => product.precio))
        );
        setMaxPrice(highestPrice || 1000);
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // Usar useCallback para evitar recrear esta función en cada renderización
  const handleFiltersChange = useCallback(
    (filters: FilterOptions) => {
      setFilteredProducts(
        allProducts.filter((product) => {
          // Filtrar por categoría
          if (
            filters.categories.length > 0 &&
            !filters.categories.includes(product.category)
          ) {
            return false;
          }

          // Filtrar por precio
          if (
            product.precio < filters.priceRange[0] ||
            product.precio > filters.priceRange[1]
          ) {
            return false;
          }

          // Filtrar por género
          if (
            filters.genders.length > 0 &&
            product.gender &&
            !filters.genders.includes(product.gender)
          ) {
            return false;
          }

          // Filtrar por disponibilidad
          if (filters.inStock !== null) {
            if (filters.inStock && product.stock <= 0) {
              return false;
            }
            if (!filters.inStock && product.stock > 0) {
              return false;
            }
          }

          return true;
        })
      );
    },
    [allProducts]
  ); // Solo se recrea cuando allProducts cambia

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Resultados de búsqueda</h1>
      <p className="text-gray-600 mb-6">
        {loading
          ? "Buscando..."
          : `${filteredProducts.length} resultados para "${query}"`}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProductFilters
            maxPrice={maxPrice}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">Cargando resultados...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                No se encontraron productos
              </h2>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o ajusta los filtros
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
