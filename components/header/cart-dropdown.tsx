"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export function CartDropdown({ isOpen, onClose, isMobile = false }: CartDropdownProps) {
  const { items, updateQuantity, removeItem, getTotal } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
    } else {
      updateQuantity(itemId, newQuantity)
    }
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose}>
        <div
          ref={dropdownRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">Shopping Cart</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 text-center mb-6">Add some products to get started</p>
                <Link href="/shop">
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                        <p className="text-sm text-[#C53D39] font-semibold">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-[#C53D39]">{formatPrice(getTotal())}</span>
                  </div>
                  <div className="space-y-3">
                    <Link href="/cart" className="block">
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white bg-transparent"
                      >
                        View Cart
                      </Button>
                    </Link>
                    <Link href="/checkout" className="block">
                      <Button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold"
                      >
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop dropdown
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      {items.length === 0 ? (
        <div className="p-6 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Your cart is empty</h3>
          <p className="text-xs text-gray-500 mb-4">Add some products to get started</p>
          <Link href="/shop">
            <Button
              onClick={onClose}
              size="sm"
              className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Shopping Cart ({items.length})</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-4 border-b border-gray-100 last:border-b-0 group"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-[#C53D39] font-semibold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">Total:</span>
              <span className="text-sm font-bold text-[#C53D39]">{formatPrice(getTotal())}</span>
            </div>
            <div className="space-y-2">
              <Link href="/cart" className="block">
                <Button
                  onClick={onClose}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white bg-transparent"
                >
                  View Cart
                </Button>
              </Link>
              <Link href="/checkout" className="block">
                <Button
                  onClick={onClose}
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white"
                >
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
