"use client"

import { useState, useRef, useEffect } from "react"
import { X, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
}

interface WishlistDropdownProps {
  isOpen: boolean
  onClose: () => void
}

// Mock wishlist data - in real app this would come from context/state
const mockWishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Modern Sectional Sofa",
    price: 1299.99,
    image: "/shop/products/sofa-1.jpg",
    inStock: true,
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 599.99,
    image: "/shop/products/chair-1.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "Dining Table Set",
    price: 899.99,
    image: "/shop/products/dining-table-1.jpg",
    inStock: false,
  },
]

export function WishlistDropdown({ isOpen, onClose }: WishlistDropdownProps) {
  const { addToCart } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== itemId))
  }

  const handleAddToCart = (item: WishlistItem) => {
    if (item.inStock) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        description: item.name,
      })
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[70vh] flex flex-col"
      style={{
        animation: isOpen ? "slideDown 0.2s ease-out" : "slideUp 0.2s ease-in",
      }}
    >
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold font-montserrat">Wishlist</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 overflow-y-auto">
        {wishlistItems.length === 0 ? (
          <div className="p-8 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-poppins">Your wishlist is empty</p>
            <Button
              onClick={onClose}
              className="mt-4 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {wishlistItems.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate font-poppins">{item.name}</h4>
                  <p className="text-[#C53D39] font-semibold text-sm">${item.price.toFixed(2)}</p>
                  {!item.inStock && <p className="text-xs text-red-500">Out of Stock</p>}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {wishlistItems.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            onClick={onClose}
          >
            <Link href="/account/wishlist">View All Wishlist</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
