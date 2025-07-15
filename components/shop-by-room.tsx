"use client"

import type React from "react"
import { useState } from "react"
import type { Product } from "@/types"
import { Heart, BarChart3, Eye, ShoppingCart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"

interface ShopByRoomProps {
  livingRoomProducts: Product[]
  bedroomProducts: Product[]
  diningRoomProducts: Product[]
  officeProducts: Product[]
}

const ShopByRoom: React.FC<ShopByRoomProps> = ({
  livingRoomProducts = [],
  bedroomProducts = [],
  diningRoomProducts = [],
  officeProducts = [],
}) => {
  const [activeTab, setActiveTab] = useState("living-room")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("PKR", "₨")
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  const handleCompare = (product: Product) => {
    addToCompare({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
    })
  }

  const tabs = [
    { id: "living-room", label: "Living Room", products: livingRoomProducts },
    { id: "bedroom", label: "Bedroom", products: bedroomProducts },
    { id: "dining-room", label: "Dining Room", products: diningRoomProducts },
    { id: "office", label: "Office", products: officeProducts },
  ]

  const activeProducts = tabs.find((tab) => tab.id === activeTab)?.products || []

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 font-montserrat">Shop by Room</h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
            Discover furniture collections perfectly curated for every space in your home
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeProducts.slice(0, 8).map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 bg-white border-0 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg?height=400&width=400"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isOnSale && product.discount && (
                        <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-medium">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isSoldOut && (
                        <Badge className="bg-gray-500 text-white px-2 py-1 text-xs font-medium">Sold Out</Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:w-24 group/btn ${
                          isInWishlist(product.id) ? "text-red-500" : "text-gray-600"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                        <span className="ml-2 text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Wishlist
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCompare(product)}
                        className={`w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:w-24 group/btn ${
                          isInCompare(product.id) ? "text-blue-500" : "text-gray-600"
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span className="ml-2 text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Compare
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleQuickView(product)}
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:w-24 group/btn text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="ml-2 text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Quick View
                        </span>
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.isSoldOut}
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-300 hover:w-24 group/btn text-gray-600 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="ml-2 text-xs opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          Add Cart
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 font-poppins line-clamp-2 group-hover:text-[#C53D39] transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-poppins">({product.reviews || 0})</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-[#C53D39] font-poppins">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through font-poppins">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.isSoldOut}
                      className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {product.isSoldOut ? "Sold Out" : "Add to Cart"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available for this room category.</p>
          </div>
        )}

        {/* View All Button */}
        {activeProducts.length > 8 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 border-2 border-[#C53D39] text-[#C53D39] hover:bg-[#C53D39] hover:text-white transition-all duration-300 font-medium bg-transparent"
            >
              View All {tabs.find((tab) => tab.id === activeTab)?.label} Furniture
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ShopByRoom
