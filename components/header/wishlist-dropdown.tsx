"use client"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Heart, ShoppingCart, Trash2, X, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

interface WishlistDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export function WishlistDropdown({ isOpen, onClose, isMobile = false }: WishlistDropdownProps) {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
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

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    toast.success(`${item.name} added to cart!`)
  }

  const handleRemoveFromWishlist = (itemId: string) => {
    removeItem(itemId)
    toast.success("Item removed from wishlist")
  }

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    removeItem(item.id)
    toast.success(`${item.name} moved to cart!`)
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
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">My Wishlist</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <Heart className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 text-center mb-6">Save items you love for later</p>
                <Link href="/shop">
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
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
                    <div className="flex flex-col space-y-2">
                      <Link href={`/product/${item.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onClose}
                          className="text-xs px-3 py-1 w-full bg-transparent"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white text-xs px-3 py-1"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs px-3 py-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-white">
              <Link href="/account/wishlist" className="block">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white bg-transparent"
                >
                  View All Wishlist Items
                </Button>
              </Link>
            </div>
          )}
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
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-gray-500 mb-4">Save items you love for later</p>
          <Link href="/shop">
            <Button
              onClick={onClose}
              size="sm"
              className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white"
            >
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">My Wishlist ({items.length})</h3>
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
                <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/product/${item.id}`}>
                    <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded text-xs flex items-center gap-1">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-500">View</span>
                    </button>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-1 hover:bg-green-50 rounded text-xs flex items-center gap-1"
                  >
                    <ShoppingCart className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">Add</span>
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="p-1 hover:bg-red-50 rounded text-xs flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link href="/account/wishlist" className="block">
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-full border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white bg-transparent"
              >
                View All Items
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
