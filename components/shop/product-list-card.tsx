"use client"

import { useState } from "react"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  material: string
  color: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
}

interface ProductListCardProps {
  product: Product
  onQuickView: (product: Product) => void
  onAddToCart: (product: Product) => void
}

export function ProductListCard({ product, onQuickView, onAddToCart }: ProductListCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  return (
    <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4">
      {/* Product Image */}
      <div className="relative w-48 h-48 flex-shrink-0">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover rounded-lg" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.isNew && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>}
          {product.isSale && discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
          )}
          {!product.inStock && <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">OUT OF STOCK</span>}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="flex-1 ml-6 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{product.category}</span>
            <span className="text-sm text-gray-600 font-medium">{product.brand}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Material & Color */}
          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
            <span>Material: {product.material}</span>
            <span>Color: {product.color}</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-gray-800">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => onQuickView(product)}
            variant="outline"
            className="flex items-center space-x-2 hover:border-amber-400 hover:bg-amber-50"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </Button>

          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
          </Button>

          <Button variant="outline" className="px-3 hover:border-amber-400 hover:bg-amber-50 bg-transparent">
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
}
