"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    if (item.inStock) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      })
    }
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist is Empty</h1>
          <p className="text-gray-600">
            Discover our amazing furniture collection and add some items to your wishlist!
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">Items you love and want to buy later</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
        </p>
        {wishlistItems.length > 0 && (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
              />
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-red-100 text-gray-600 hover:text-red-500 flex items-center justify-center transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{item.name}</h3>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-gray-900">₨{item.price.toLocaleString()}</span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₨{item.originalPrice.toLocaleString()}</span>
                )}
              </div>
              {!item.inStock && <p className="text-xs text-red-500 mb-2">Out of Stock</p>}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                  className="flex-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/product/${item.id}`}>
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
