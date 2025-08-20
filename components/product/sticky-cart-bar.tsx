"use client"

import { useState, useEffect } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

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
      setIsVisible(scrollPosition > windowHeight)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 truncate max-w-48">{product.name}</h3>
              <p className="text-lg font-bold text-gray-900">PKR{product.price}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 font-medium">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="p-2 hover:bg-gray-50 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <Button
              onClick={() => onAddToCart(quantity)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
