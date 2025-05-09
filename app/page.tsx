import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getRecentProducts, getRandomProducts } from "@/lib/products"

export default async function Home() {
  const recentProducts = await getRecentProducts()
  const randomProducts = await getRandomProducts(10)

  return (
    <main className="min-h-screen">
      <section className="container mx-auto py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Productos Agregados Recientemente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Productos Destacados</h2>
            <Link href="/products">
              <Button>Ver Todo</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {randomProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
