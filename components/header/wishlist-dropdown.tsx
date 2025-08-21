"use client"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Heart, Eye, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface WishlistDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function WishlistDropdown({ isOpen, onClose }: WishlistDropdownProps) {
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const wishlistCount = wishlistItems.length

  const handleRemoveFromWishlist = (itemId: string) => {
    removeFromWishlist(itemId)
    toast.success("Item removed from wishlist")
  }

  const handleMoveToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    removeFromWishlist(item.id)
    toast.success(`${item.name} moved to cart!`)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wishlist ({wishlistCount})</h3>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
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
                <div className="flex gap-1">
                  <Link href={`/product/${item.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={onClose}>
                      <Eye className="h-4 w-4 text-gray-500" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMoveToCart(item)}
                    className="h-8 w-8 p-0 hover:bg-green-50 text-green-500 hover:text-green-700"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <Link href="/account/wishlist" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                  onClick={onClose}
                >
                  View Wishlist
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
