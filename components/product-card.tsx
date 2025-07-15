"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingBag, Eye, RotateCcw, Star } from "lucide-react"
import Image from "next/image"
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
  isNew?: boolean
  isSale?: boolean
  discount?: number
  tags?: string[]
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare } = useCompare()
  const { toast } = useToast()

  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
      addToWishlist(product)
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addToCompare(product)
    toast({
      title: "Added to Compare",
      description: `${product.name} has been added to comparison`,
    })
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <Card
      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Product Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Link href={`/product/${product.id}`}>
            <Image
              src={isHovered && product.hoverImage ? product.hoverImage : product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1">NEW</Badge>
            )}
            {product.isSale && product.discount && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">-{product.discount}%</Badge>
            )}
            {!product.inStock && (
              <Badge className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1">SOLD OUT</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                isWishlisted
                  ? "bg-[#C53D39] text-white"
                  : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-[#C53D39] hover:text-white"
              }`}
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>

            <button
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-[#C53D39] hover:text-white transition-all duration-300 shadow-lg"
              title="Quick View"
            >
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={handleCompare}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-[#C53D39] hover:text-white transition-all duration-300 shadow-lg"
              title="Add to Compare"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Add to Cart Button */}
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-[#C53D39] hover:bg-[#B12E2A] text-white shadow-lg"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.category}</p>
          )}

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-[#C53D39] transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && product.rating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating!) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-[#C53D39]">PKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
