"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import api from "@/lib/api";

export interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  genders: string[];
  inStock: boolean | null;
}

interface ProductFiltersProps {
  maxPrice: number;
  onFiltersChange: (filters: ProductFilters) => void;
  initialFilters?: Partial<ProductFilters>;
}

export default function ProductFilters({
  maxPrice = 1000,
  onFiltersChange,
  initialFilters = {},
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<ProductFilters>({
    categories: initialFilters.categories || [],
    priceRange: initialFilters.priceRange || [0, maxPrice],
    genders: initialFilters.genders || [],
    inStock:
      initialFilters.inStock === undefined ? null : initialFilters.inStock,
  });

  // Usar useRef para evitar el primer efecto al montar el componente
  const isInitialMount = useRef(true);

  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    []
  );
  const [genders, setGenders] = useState<{ id: string; label: string }[]>([]);

  // Cargar categorías y géneros desde la API
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
      console.log(gens);
      setGenders(
        gens.map((gen: any) => ({
          id: gen._id || gen.id,
          label: gen.nombre || gen.label || gen.name,
        }))
      );
    };
    fetchFilters();
  }, []);
  // Actualizar el rango de precios cuando cambia maxPrice
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice],
    }));
  }, [maxPrice]);

  // Notificar cambios en los filtros, pero evitar la primera ejecución
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Manejar cambios en las categorías
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  // Manejar cambios en los géneros
  const handleGenderChange = (genderId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      genders: checked
        ? [...prev.genders, genderId]
        : prev.genders.filter((id) => id !== genderId),
    }));
  };

  // Manejar cambios en la disponibilidad
  const handleStockChange = (stockOption: string, checked: boolean) => {
    if (!checked) return; // Solo procesamos cuando se marca un checkbox

    setFilters((prev) => ({
      ...prev,
      inStock:
        stockOption === "in-stock"
          ? true
          : stockOption === "out-of-stock"
          ? false
          : null,
    }));
  };

  // Limpiar todos los filtros
  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      genders: [],
      inStock: null,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Filtros</h3>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleClearFilters}
        >
          Limpiar Filtros
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "precio", "gender", "availability"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked === true)
                    }
                  />
                  <Label htmlFor={category.id}>{category.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="precio">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, maxPrice]}
                max={maxPrice}
                step={10}
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
              />
              <div className="flex items-center justify-between">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gender">
          <AccordionTrigger>Género</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {genders.map((gender) => (
                <div key={gender.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={gender.id}
                    checked={filters.genders.includes(gender.id)}
                    onCheckedChange={(checked) =>
                      handleGenderChange(gender.id, checked === true)
                    }
                  />
                  <Label htmlFor={gender.id}>{gender.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>Disponibilidad</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock === true}
                  onCheckedChange={(checked) =>
                    handleStockChange("in-stock", checked === true)
                  }
                />
                <Label htmlFor="in-stock">En Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="out-of-stock"
                  checked={filters.inStock === false}
                  onCheckedChange={(checked) =>
                    handleStockChange("out-of-stock", checked === true)
                  }
                />
                <Label htmlFor="out-of-stock">Agotado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-stock"
                  checked={filters.inStock === null}
                  onCheckedChange={(checked) =>
                    handleStockChange("all-stock", checked === true)
                  }
                />
                <Label htmlFor="all-stock">Todos</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
