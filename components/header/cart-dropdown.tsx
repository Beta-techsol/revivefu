"use client"

import { useRef, useEffect } from "react"
import { X, ShoppingBag, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image"
import Link from "next/link"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { items, updateQuantity, removeFromCart, total } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden max-h-[80vh] flex flex-col"
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
          <h3 className="font-semibold font-montserrat">Shopping Cart</h3>
          <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-poppins">Your cart is empty</p>
            <Button
              onClick={onClose}
              className="mt-4 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate font-poppins">{item.name}</h4>
                  <p className="text-[#C53D39] font-semibold">${item.price.toFixed(2)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold font-montserrat">Total:</span>
            <span className="text-xl font-bold text-[#C53D39]">${total.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={onClose}
            >
              <Link href="/cart">View Cart</Link>
            </Button>
            <Button
              asChild
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={onClose}
            >
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
