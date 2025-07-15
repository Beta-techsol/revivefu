"use client"

import { useState } from "react"
import { Star, Minus, Plus, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    rating: number
    reviewCount: number
    colors: { name: string; value: string }[]
    sizes: string[]
    sku: string
    categories: string[]
    inStock: boolean
    description: string
  }
  onAddToCart: (quantity: number, color: string, size: string) => void
  onBuyNow: (quantity: number, color: string, size: string) => void
  onCompare: () => void
}

export default function ProductDetails({ product, onAddToCart, onBuyNow, onCompare }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Product Title & Rating */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
        )}
        {product.originalPrice && (
          <Badge variant="destructive" className="text-sm">
            Save {formatPrice(product.originalPrice - product.price)}
          </Badge>
        )}
      </div>

      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color.name ? "border-gray-900 scale-110" : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">Selected: {selectedColor}</p>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-medium">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">{product.inStock ? "In Stock" : "Out of Stock"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            onClick={() => onAddToCart(quantity, selectedColor, selectedSize)}
            disabled={!product.inStock}
            className="flex-1"
            size="lg"
          >
            Add to Cart
          </Button>
          <Button onClick={() => onCompare()} variant="outline" size="lg" className="px-4">
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={() => onBuyNow(quantity, selectedColor, selectedSize)}
          disabled={!product.inStock}
          className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600"
          size="lg"
        >
          Buy It Now
        </Button>
      </div>

      {/* Security Trust Icons */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <Image src="/security/mcafee.png" alt="McAfee Secure" width={60} height={30} />
          <Image src="/security/norton.png" alt="Norton Secured" width={60} height={30} />
          <Image src="/security/verisign.png" alt="VeriSign" width={60} height={30} />
          <Image src="/security/truste.png" alt="TRUSTe" width={60} height={30} />
        </div>
      </div>

      {/* Product Info */}
      <div className="border-t pt-6 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">SKU:</span> {product.sku}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Categories:</span> {product.categories.join(", ")}
        </p>
      </div>
    </div>
  )
}
