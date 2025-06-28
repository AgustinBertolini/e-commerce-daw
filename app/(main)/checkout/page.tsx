"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCartStore } from "@/lib/cart-store";
import api from "@/lib/api";
import { getCurrentUserId } from "@/lib/auth";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const [paymentMethod, setPaymentMethod] = useState("mercadopago");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handlePayment = async () => {
    // Validar datos de envío
    if (
      !shippingInfo.firstName.trim() ||
      !shippingInfo.lastName.trim() ||
      !shippingInfo.address.trim() ||
      !shippingInfo.city.trim() ||
      !shippingInfo.postalCode.trim() ||
      !shippingInfo.phone.trim()
    ) {
      setError(
        "Por favor completa todos los datos de envío antes de continuar."
      );
      return;
    }
    try {
      setError("");
      setProcessingPayment(true);
      // Obtener usuario actual
      const userId = getCurrentUserId();
      if (!userId) {
        setError(
          "No se pudo identificar el usuario. Iniciá sesión nuevamente."
        );
        setProcessingPayment(false);
        return;
      }
      // Calcular total y envío (envío fijo 0 para mockup)
      const total = calculateTotal();
      const envio = 0;
      // Crear compra en el backend
      const compra = await api.compras.create({
        usuario: userId,
        total,
        envio,
        productos: cartItems.map((item) => ({
          producto: item.product._id, // debe ser el ObjectId del producto
          cantidad: item.quantity,
        })),
        // estado, fechaCreacion y fechaActualizacion los setea el backend
      });
      // Vaciar el carrito si la compra fue exitosa
      useCartStore.getState().clearCart();
      // Redirigir a la pantalla de éxito con el id de la compra
      router.push(`/checkout/success?orderId=${compra._id}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(
        "Hubo un error al procesar el pago. Por favor intenta nuevamente."
      );
    } finally {
      setProcessingPayment(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          No hay productos en tu carrito
        </h1>
        <Button onClick={() => (window.location.href = "/products")}>
          Ver productos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Información de Envío</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Tu nombre"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Tu apellido"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  placeholder="Calle y número"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Ciudad"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  placeholder="Código postal"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="Tu número de teléfono"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

            <div className="max-h-60 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center gap-2 py-2 border-b"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      src={
                        item.product.image ||
                        "/placeholder.svg?height=48&width=48"
                      }
                      alt={
                        item.product.nombre || item.product.name || "Producto"
                      }
                      width={48}
                      height={48}
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {item.product.nombre || item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      $
                      {(item.product.precio * item.quantity).toLocaleString(
                        "es-AR"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={processingPayment}
            >
              {processingPayment ? "Procesando..." : "Pagar con MercadoPago"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
