"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Share2, ShoppingBag, CreditCard, Plus, Minus, RotateCcw } from "lucide-react"

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
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    onAddToCart(quantity, selectedColor, selectedSize)
  }

  const handleBuyNow = () => {
    onBuyNow(quantity, selectedColor, selectedSize)
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div>
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight pr-4">{product.name}</h1>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted
                  ? "bg-[#C53D39] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-[#C53D39] hover:text-white"
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline space-x-3">
          <span className="text-4xl font-bold text-[#C53D39]">PKR {product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
              <Badge className="bg-red-500 text-white">-{discount}% OFF</Badge>
            </>
          )}
        </div>
        <p className="text-sm text-gray-600">
          SKU: {product.sku} | Stock: {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      <Separator />

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Color: {selectedColor}</h3>
          <div className="flex space-x-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  selectedColor === color.name
                    ? "border-[#C53D39] ring-2 ring-[#C53D39] ring-offset-2"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Size: {selectedSize}</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-all duration-300 ${
                  selectedSize === size
                    ? "border-[#C53D39] bg-[#C53D39] text-white"
                    : "border-gray-300 hover:border-[#C53D39] hover:text-[#C53D39]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-3 hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-6 py-3 font-medium min-w-[4rem] text-center">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="p-3 hover:bg-gray-50 transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-600">Total: PKR {(product.price * quantity).toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-[#C53D39] hover:bg-[#B12E2A] text-white py-3 text-lg"
            size="lg"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            disabled={!product.inStock}
            variant="outline"
            className="w-full border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white py-3 text-lg bg-transparent"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Buy Now
          </Button>
        </div>

        <Button onClick={onCompare} variant="outline" className="w-full bg-transparent" size="lg">
          <RotateCcw className="h-5 w-5 mr-2" />
          Add to Compare
        </Button>
      </div>

      {/* Product Description */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Description</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Delivery Information */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-2">Delivery Information</h4>
        <ul className="space-y-1 text-sm text-green-700">
          <li>• Free delivery on orders over PKR 50,000</li>
          <li>• Cash on Delivery available</li>
          <li>• Estimated delivery: 3-7 business days</li>
          <li>• Easy returns within 30 days</li>
        </ul>
      </div>
    </div>
  )
}
