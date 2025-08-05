"use client"

import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import { useCart } from "@/hooks/use-cart"
import { Scale, Trash2, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface CompareDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CompareDropdown({ isOpen, onClose }: CompareDropdownProps) {
  const { items: compareItems, removeItem: removeFromCompare } = useCompare()
  const { addItem: addToCart } = useCart()
  const compareCount = compareItems.length

  const handleRemoveFromCompare = (itemId: string) => {
    removeFromCompare(itemId)
    toast.success("Item removed from compare")
  }

  const handleClearAll = () => {
    compareItems.forEach((item) => removeFromCompare(item.id))
    toast.success("All items removed from compare")
  }

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
    toast.success(`${item.name} added to cart!`)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Compare ({compareCount})</h3>
          {compareItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        {compareItems.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No items to compare</p>
          </div>
        ) : (
          <div className="space-y-4">
            {compareItems.map((item) => (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddToCart(item)}
                    className="h-8 w-8 p-0 hover:bg-green-50 text-green-500 hover:text-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromCompare(item.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="border-t pt-4">
              <Link href="/compare" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F]"
                  onClick={onClose}
                >
                  <Eye className="h-3 w-3 mr-2" />
                  Compare Items
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
