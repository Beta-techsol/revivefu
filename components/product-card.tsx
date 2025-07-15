"use client"
import { Card } from "@/components/ui/card"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
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
  category?: string
  rating?: number
  reviews?: number
  inStock?: boolean
  stockQuantity?: number
  isNew?: boolean
  isSale?: boolean
  tags?: string[]
  description?: string
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product.id)
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) {
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

  const currentImage = isHovered && product.hoverImage && !imageError ? product.hoverImage : product.image

  return (
    <Card
      className={`group relative overflow-hidden bg-white transition-all duration-300 transform hover:-translate-y-1 ${
        isHovered ? "border-[#C53D39]/50 border-[0.5px]" : "border-gray-200 border"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-${product.id}`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`}>
          <Image
            src={currentImage || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
          {product.isSale && discount > 0 && <Badge className="bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>}
          {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          {onQuickView && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          )}
        </div>

        {/* Add to Cart Button - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-[#C53D39] hover:bg-[#B12E2A] text-white"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        {/* Category */}
        {product.category && <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.category}</p>}

        <div className="space-y-1">
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#C53D39] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
          </div>
        )}

        {/* Stock Info */}
        {product.stockQuantity !== undefined && (
          <div className="mb-2">
            {product.stockQuantity > 0 ? (
              <p className="text-xs text-green-600">
                {product.stockQuantity > 10 ? "In Stock" : `Only ${product.stockQuantity} left`}
              </p>
            ) : (
              <p className="text-xs text-red-600">Out of Stock</p>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Card>
  )
}
