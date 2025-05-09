import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { getProductById } from "@/lib/products"
import AddToCartForm from "@/components/add-to-cart-form"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-yellow-600">${product.price.toFixed(2)}</p>

          <div className="border-t border-b py-4 my-4">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Categoría:</span> {product.category}
            </p>
            {product.gender && (
              <p>
                <span className="font-semibold">Género:</span> {product.gender}
              </p>
            )}
            <p>
              <span className="font-semibold">Disponible:</span> {product.stock > 0 ? "En stock" : "Agotado"}
            </p>
          </div>

          <AddToCartForm product={product} />

          <Button variant="outline" className="w-full mt-4">
            <Heart className="mr-2 h-4 w-4" />
            Agregar a Favoritos
          </Button>
        </div>
      </div>
    </div>
  )
}
