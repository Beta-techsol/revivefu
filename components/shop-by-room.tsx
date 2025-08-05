"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye, RotateCcw, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookOpen, Gamepad2, Bed, Home } from "lucide-react"
import { QuickViewModal } from "./quick-view-modal"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  image: string
  images: string
  description: string
  average_rating?: number
  review_count?: number
  stock_quantity?: number
  room_type?: string
  room_type_name?: string
}

interface RoomCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  productCount: number
  featuredImage: string
  products: Product[]
}

// Keep the same room categories with appropriate featured images
const roomCategories: RoomCategory[] = [
  {
    id: "study-room",
    name: "Study Room",
    icon: BookOpen,
    productCount: 0,
    featuredImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/studyrm.jpg-1y0xiGTsCe6C4lCKp9FZyLNsHEfNLl.jpeg",
    products: [],
  },
  {
    id: "gaming-room",
    name: "Gaming Room",
    icon: Gamepad2,
    productCount: 0,
    featuredImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gaminr.jpg-opoahpZjBgtqOjXA6ZBE9nfXWAAI23.jpeg",
    products: [],
  },
  {
    id: "bed-room",
    name: "Bed Room",
    icon: Bed,
    productCount: 0,
    featuredImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4182.jpg-mepKLxXnoUGLDT5g3PLHJjP5lt3DbO.jpeg",
    products: [],
  },
  {
    id: "home-decor",
    name: "Home Decor",
    icon: Home,
    productCount: 0,
    featuredImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/homedecor.jpg-1kZ1ydIWjpQzyzbPenyC0g3GCHyuCh.jpeg",
    products: [],
  },
]

// Helper function to get product images
const getProductImages = (product: Product): string[] => {
  try {
    if (product.images) {
      const parsed = JSON.parse(product.images)
      return Array.isArray(parsed) ? parsed : []
    }
    return []
  } catch {
    return []
  }
}

// Helper function to get first product image
const getFirstProductImage = (product: Product): string => {
  const images = getProductImages(product)
  return images.length > 0 ? images[0] : "/placeholder.svg?height=300&width=300"
}

export function ShopByRoom() {
  const [activeCategory, setActiveCategory] = useState("study-room")
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [roomData, setRoomData] = useState<RoomCategory[]>(roomCategories)
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [productsPerView, setProductsPerView] = useState(5)

  // Hooks for functionality
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()

  const activeRoom = roomData.find((room) => room.id === activeCategory) || roomData[0]
  const maxProductIndex = Math.max(0, activeRoom.products.length - productsPerView)

  // Fetch products for all room types
  useEffect(() => {
    const fetchRoomProducts = async () => {
      setLoading(true)
      try {
        const updatedRooms = await Promise.all(
          roomCategories.map(async (room) => {
            try {
              // Map room IDs to database room type slugs
              const roomTypeMap: { [key: string]: string } = {
                "study-room": "study-room",
                "gaming-room": "gaming-room",
                "bed-room": "bedroom",
                "home-decor": "home-decor",
              }

              const roomTypeSlug = roomTypeMap[room.id] || room.id
              const response = await fetch(`/api/products?room_type=${roomTypeSlug}&limit=20`)

              if (!response.ok) {
                console.warn(`Failed to fetch products for ${room.name}`)
                return { ...room, products: [], productCount: 0 }
              }

              const data = await response.json()

              if (data.success && data.products) {
                const transformedProducts = data.products.slice(0, 20).map((product: any) => ({
                  ...product,
                  image: getFirstProductImage(product),
                }))

                return {
                  ...room,
                  products: transformedProducts,
                  productCount: transformedProducts.length,
                }
              }

              return { ...room, products: [], productCount: 0 }
            } catch (error) {
              console.error(`Error fetching products for ${room.name}:`, error)
              return { ...room, products: [], productCount: 0 }
            }
          }),
        )

        setRoomData(updatedRooms)
      } catch (error) {
        console.error("Error fetching room products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomProducts()
  }, [])

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateProductsPerView = () => {
      setProductsPerView(window.innerWidth < 640 ? 1 : 5)
    }

    updateProductsPerView()
    window.addEventListener("resize", updateProductsPerView)
    return () => window.removeEventListener("resize", updateProductsPerView)
  }, [])

  const nextProducts = () => {
    setCurrentProductIndex((prev) => Math.min(prev + 1, maxProductIndex))
  }

  const prevProducts = () => {
    setCurrentProductIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  // Handle wishlist toggle
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

  // Handle compare toggle
  const handleCompareToggle = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id)
    } else {
      addToCompare({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.room_type || "furniture",
      })
    }
  }

  // Reset product index when category changes
  useEffect(() => {
    setCurrentProductIndex(0)
  }, [activeCategory])

  return (
    <section ref={sectionRef} className="py-8 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Animation */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">Room</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect furniture for every space in your home
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Layout with Animation */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Left Sidebar - Category Tabs */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {roomData.map((category, index) => {
                  const IconComponent = category.icon
                  const isActive = activeCategory === category.id

                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 rounded-lg text-left transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:transform hover:scale-102"
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <IconComponent className="h-4 w-4 sm:h-6 sm:w-6" />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm tracking-wide">{category.name}</div>
                        <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                          {loading ? "Loading..." : `${category.productCount} Products`}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Featured Image */}
            <div className="lg:col-span-3">
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
                <Image
                  src={activeRoom.featuredImage || "/placeholder.svg"}
                  alt={`${activeRoom.name} room`}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Room Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                    {activeRoom.name.toUpperCase()}
                  </span>
                </div>

                {/* Product Count Badge */}
                <div className="absolute bottom-6 right-6">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    {loading ? "Loading..." : `${activeRoom.productCount} Products Available`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section with Animation */}
          <div
            className={`space-y-6 relative transition-all duration-1000 delay-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">Loading products...</div>
              </div>
            ) : activeRoom.products.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">No products found for {activeRoom.name}</div>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentProductIndex * (100 / productsPerView)}%)`,
                    }}
                  >
                    {activeRoom.products.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex-shrink-0 px-3"
                        style={{
                          width: `${100 / productsPerView}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        {/* Clean Product Card */}
                        <div
                          className="group relative transition-all duration-300 transform hover:scale-105"
                          onMouseEnter={() => setHoveredProduct(product.id)}
                          onMouseLeave={() => {
                            setHoveredProduct(null)
                            setHoveredIcon(null)
                          }}
                        >
                          {/* Product Image Container */}
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md">
                            <Link href={`/product/${product.id}`}>
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-300 cursor-pointer"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                loading="lazy"
                              />
                            </Link>

                            {/* Sale/Stock Badges */}
                            <div className="absolute top-3 left-3 flex flex-col space-y-2">
                              {product.compare_price && product.compare_price > product.price && (
                                <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-2 py-1 text-xs font-medium rounded-full">
                                  SALE
                                </span>
                              )}
                              {product.stock_quantity !== undefined &&
                                product.stock_quantity < 10 &&
                                product.stock_quantity > 0 && (
                                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                                    LOW STOCK
                                  </span>
                                )}
                            </div>

                            {/* Hover Overlay - All Icons on Right Side */}
                            {hoveredProduct === product.id && (
                              <div className="absolute inset-0 z-20">
                                {/* All Action Icons - Right Side Vertically */}
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3">
                                  {/* Quick View Icon */}
                                  <div className="relative">
                                    <button
                                      onClick={() => handleQuickView(product)}
                                      onMouseEnter={() => setHoveredIcon("quickview")}
                                      onMouseLeave={() => setHoveredIcon(null)}
                                      className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                                        hoveredIcon === "quickview"
                                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                          : "bg-white text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>

                                    {/* Expanding Button */}
                                    {hoveredIcon === "quickview" && (
                                      <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                        <span>Quick View</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Compare Icon */}
                                  <div
                                    className="relative"
                                    onMouseEnter={() => setHoveredIcon("compare")}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                  >
                                    <button
                                      onClick={() => handleCompareToggle(product)}
                                      className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                        hoveredIcon === "compare" || isInCompare(product.id)
                                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                          : "bg-white text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                    </button>

                                    {/* Expanding Button */}
                                    {hoveredIcon === "compare" && (
                                      <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                        <span>{isInCompare(product.id) ? "Remove" : "Compare"}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Wishlist Icon */}
                                  <div
                                    className="relative"
                                    onMouseEnter={() => setHoveredIcon("wishlist")}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                  >
                                    <button
                                      onClick={() => handleWishlistToggle(product)}
                                      className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                        hoveredIcon === "wishlist" || isInWishlist(product.id)
                                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                          : "bg-white text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                                    </button>

                                    {/* Expanding Button */}
                                    {hoveredIcon === "wishlist" && (
                                      <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                        <span>{isInWishlist(product.id) ? "Remove" : "Wishlist"}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Cart Icon */}
                                  <div
                                    className="relative"
                                    onMouseEnter={() => setHoveredIcon("cart")}
                                    onMouseLeave={() => setHoveredIcon(null)}
                                  >
                                    <button
                                      onClick={() => handleAddToCart(product)}
                                      className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                        hoveredIcon === "cart"
                                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                          : "bg-white text-gray-600 hover:bg-gray-50"
                                      }`}
                                    >
                                      <ShoppingCart className="h-4 w-4" />
                                    </button>

                                    {/* Expanding Button */}
                                    {hoveredIcon === "cart" && (
                                      <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                        <span>Add to Cart</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Product Info - Clean and Simple */}
                          <div className="text-center space-y-2">
                            <Link href={`/product/${product.id}`}>
                              <h3 className="font-medium text-gray-900 text-sm hover:text-[#C53D39] transition-colors cursor-pointer">
                                {product.name}
                              </h3>
                            </Link>
                            <div className="text-gray-900 font-semibold">
                              <div className="flex items-center justify-center space-x-2">
                                <span>Rs{product.price.toFixed(2)}</span>
                                {product.compare_price && product.compare_price > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    Rs{product.compare_price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Stock Quantity */}
                            {product.stock_quantity !== undefined && (
                              <div className="text-xs text-gray-600">Stock: {product.stock_quantity}</div>
                            )}
                            {/* Rating - Only show if rating exists and > 0 */}
                            {product.average_rating && product.average_rating > 0 && (
                              <div className="flex items-center justify-center space-x-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-xs ${
                                        i < Math.floor(product.average_rating || 0)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">({product.review_count || 0})</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows - Bottom Right Corner */}
                {activeRoom.products.length > productsPerView && (
                  <div className="absolute bottom-0 right-0 flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={prevProducts}
                      disabled={currentProductIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={nextProducts}
                      disabled={currentProductIndex === maxProductIndex}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Removed Progress Indicator (pagination dots) */}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
    </section>
  )
}
