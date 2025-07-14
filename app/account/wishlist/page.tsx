"use client"

import { useState } from "react"
import { Heart, ShoppingCart, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const [sortBy, setSortBy] = useState("newest")
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      name: "Modern Sectional Sofa",
      price: 1299,
      originalPrice: 1599,
      image: "/shop/products/sofa-1.jpg",
      inStock: true,
      dateAdded: "2024-12-15",
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      price: 599,
      originalPrice: null,
      image: "/shop/products/chair-1.jpg",
      inStock: true,
      dateAdded: "2024-12-10",
    },
    {
      id: "3",
      name: "Solid Wood Dining Table",
      price: 899,
      originalPrice: 1099,
      image: "/shop/products/dining-table-1.jpg",
      inStock: false,
      dateAdded: "2024-12-05",
    },
    {
      id: "4",
      name: "Platform Bed Frame",
      price: 749,
      originalPrice: null,
      image: "/shop/products/bed-1.jpg",
      inStock: true,
      dateAdded: "2024-12-01",
    },
    {
      id: "5",
      name: "Coffee Table Set",
      price: 449,
      originalPrice: 549,
      image: "/shop/products/coffee-table-1.jpg",
      inStock: true,
      dateAdded: "2024-11-28",
    },
    {
      id: "6",
      name: "Wardrobe Cabinet",
      price: 999,
      originalPrice: null,
      image: "/shop/products/wardrobe-1.jpg",
      inStock: true,
      dateAdded: "2024-11-25",
    },
  ])

  const removeFromWishlist = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id))
  }

  const addToCart = (item: any) => {
    // Add to cart logic here
    console.log("Added to cart:", item.name)
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    }
  })

  const breadcrumbItems = [{ label: "Account", href: "/account" }, { label: "Wishlist" }]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">{wishlistItems.length} items saved for later</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white shadow-lg border-0 rounded-xl hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 rounded-t-xl overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                      {item.originalPrice && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                          Save ${item.originalPrice - item.price}
                        </Badge>
                      )}
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-t-xl flex items-center justify-center">
                          <Badge className="bg-gray-800 text-white border-0">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900">${item.price}</span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => addToCart(item)}
                          disabled={!item.inStock}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </Button>
                        <Button
                          onClick={() => removeFromWishlist(item.id)}
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                        >
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Save items you love to your wishlist and shop them later</p>
                <Link href="/shop">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
