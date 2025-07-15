"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import Image from "next/image"

interface StickyCartBarProps {
  product: {
    name: string
    price: number
    image: string
  }
  onAddToCart: (quantity: number) => void
}

export default function StickyCartBar({ product, onAddToCart }: StickyCartBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Show sticky bar when user scrolls down past the first screen
      setIsVisible(scrollPosition > windowHeight * 0.5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change)
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    onAddToCart(quantity)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 transform transition-transform duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate text-sm">{product.name}</h3>
              <p className="text-[#C53D39] font-bold text-lg">PKR {product.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-50 transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleAddToCart} className="bg-[#C53D39] hover:bg-[#B12E2A] text-white px-6">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
