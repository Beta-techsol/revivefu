"use client"

import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description?: string
  rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  category?: string
  material?: string
  color?: string
  brand?: string
  reviews?: number
  inStock?: boolean
  slug?: string
}

interface RelatedProductsProps {
  currentProductId: string
  categoryId: string
  products?: Product[]
}

function RelatedProducts({ currentProductId, categoryId, products = [] }: RelatedProductsProps) {
  // Filter out the current product and limit to 8 related products
  const relatedProducts = products.filter((product) => product.id !== currentProductId).slice(0, 8)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
        <p className="text-gray-600">Discover similar products you might like</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
export { RelatedProducts }
