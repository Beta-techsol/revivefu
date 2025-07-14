"use client"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useCompare } from "@/hooks/use-compare"
import { Heart, Eye, ShoppingBag, Star, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

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
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleCompare = () => {
    const compareItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category || "",
      material: product.material || "",
      color: product.color || "",
      brand: product.brand || "",
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      inStock: product.inStock !== false,
    }

    if (isInCompare(product.id)) {
      removeFromCompare(product.id)
    } else {
      addToCompare(compareItem)
    }
  }

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <Card
      className="group relative overflow-hidden bg-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-gray-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`}>
          <Image
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.isSoldOut && (
            <span className="bg-gray-800 text-white px-3 py-1 text-xs font-medium rounded-full">Sold Out</span>
          )}
          {product.isOnSale && product.discount && (
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-3 py-1 text-xs font-medium rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist and Compare buttons - top right */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted ? "bg-[#C53D39] text-white" : "bg-white/90 text-gray-600 hover:bg-[#C53D39] hover:text-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={handleCompare}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isInCompare(product.id)
                ? "bg-[#C53D39] text-white"
                : "bg-white/90 text-gray-600 hover:bg-[#C53D39] hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>

        {/* Hover overlay with action buttons - appears over the image */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-2 w-full px-4">
            {/* Quick View Button */}
            <button
              onClick={handleQuickView}
              className="w-full bg-white/95 hover:bg-white text-gray-900 text-sm py-2 rounded-md flex items-center justify-center transition-all duration-300 hover:shadow-md"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </button>

            {/* Quick Shop Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.isSoldOut}
              className={`w-full text-sm py-2 rounded-md flex items-center justify-center transition-all duration-300 hover:shadow-md ${
                product.isSoldOut
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
              }`}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {product.isSoldOut ? "Sold Out" : "Quick Shop"}
            </button>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <div className="space-y-1">
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">{product.name}</h3>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < product.rating! ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
