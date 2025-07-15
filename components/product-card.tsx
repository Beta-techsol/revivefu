"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    hoverImage?: string
    description?: string
    rating?: number
    reviews?: number
    inStock?: boolean
    stockQuantity?: number
    isNew?: boolean
    isSale?: boolean
    isOnSale?: boolean
    isSoldOut?: boolean
    discount?: number
    tags?: string[]
  }
  onQuickView?: (product: any) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product.id)
  const isOutOfStock = product.isSoldOut || (product.stockQuantity !== undefined && product.stockQuantity === 0)
  const isOnSale =
    product.isSale || product.isOnSale || (product.originalPrice && product.originalPrice > product.price)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const getDiscountPercentage = () => {
    if (product.discount) return product.discount
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return 0
  }

  const currentImage = isHovered && product.hoverImage && !imageError ? product.hoverImage : product.image
  const fallbackImage = "/placeholder.svg?height=400&width=400"

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={imageError ? fallbackImage : currentImage || fallbackImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">New</Badge>}
          {isOnSale && getDiscountPercentage() > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">
              -{getDiscountPercentage()}%
            </Badge>
          )}
          {isOutOfStock && (
            <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1">Out of Stock</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 rounded-full p-0 bg-white/90 hover:bg-white shadow-md"
            onClick={handleQuickView}
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>

        {/* Add to Cart Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-[#C53D39] hover:bg-[#B12E2A] text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            size="sm"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-[#C53D39] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-[#C53D39]">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock Info */}
        {product.stockQuantity !== undefined && (
          <div className="text-sm text-gray-500">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">In Stock ({product.stockQuantity} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
