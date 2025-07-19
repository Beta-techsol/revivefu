"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"

interface CartDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const cartContext = useCart()
  const [isLoading, setIsLoading] = useState(false)

  if (!cartContext) {
    return null
  }

  const { items, removeFromCart, updateQuantity } = cartContext
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleDeleteItem = async (itemId: string) => {
    try {
      setIsLoading(true)
      // Custom delete implementation
      const updatedItems = items.filter((item) => item.id !== itemId)
      localStorage.setItem("cart", JSON.stringify(updatedItems))

      // Force re-render by calling the hook function
      if (removeFromCart && typeof removeFromCart === "function") {
        removeFromCart(itemId)
      }

      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      setIsLoading(true)

      if (newQuantity <= 0) {
        await handleDeleteItem(itemId)
        return
      }

      // Custom quantity update
      const updatedItems = items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      localStorage.setItem("cart", JSON.stringify(updatedItems))

      if (updateQuantity && typeof updateQuantity === "function") {
        updateQuantity(itemId, newQuantity)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
      toast.error("Failed to update quantity")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart ({itemCount})</h3>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                  <p className="text-sm font-semibold text-[#C53D39]">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => handleDeleteItem(item.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-[#C53D39]">
                  {formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                </span>
              </div>
              <div className="space-y-2">
                <Link href="/cart" className="block">
                  <Button
                    className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                    onClick={onClose}
                  >
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" className="block">
                  <Button variant="outline" className="w-full bg-transparent" onClick={onClose}>
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
