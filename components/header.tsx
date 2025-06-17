"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, User, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { logoutUser } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Chequear si la cookie 'token' existe y tiene valor
    const token = Cookies.get("token");
    setShowHeader(!!token);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logoutUser();
    setShowHeader(false);
    router.push("/login");
  };

  if (!showHeader) return null;

  return (
    <header className="bg-yellow-400 p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            MercadoClone
          </Link>
          <div className="flex-1 mx-4">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar productos..."
                className="w-full p-2 rounded-md rounded-r-none border-r-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                className="rounded-l-none h-[38px]"
                variant="default"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost">
                <ShoppingCart className="h-5 w-5 mr-1" />
                Carrito
              </Button>
            </Link>
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                className="flex items-center"
                onClick={toggleDropdown}
              >
                <User className="h-5 w-5 mr-1" />
                Mi Cuenta
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Ver Perfil
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Favoritos
                    </Link>
                    <Link
                      href="/purchases"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mis Compras
                    </Link>
                    <Link
                      href="/admin/products"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mis Productos
                    </Link>
                    <a
                      href="#"
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
