"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { QuickViewModal } from "./quick-view-modal"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"
import { ChevronLeft, ChevronRight, Star, Eye, RotateCcw, Heart, ShoppingCart } from "lucide-react"

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
  category?: string
  category_name?: string
}

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  products: Product[]
}

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

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("featured")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [tabs, setTabs] = useState<Tab[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const productsPerView = 4

  // Hooks for functionality
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0]
  const maxIndex = activeTabData ? Math.max(0, activeTabData.products.length - productsPerView) : 0

  // Fetch products for all tabs
  useEffect(() => {
    const fetchTabProducts = async () => {
      setLoading(true)
      try {
        // Fetch featured products (random selection)
        const featuredResponse = await fetch("/api/products/random?limit=20")
        const featuredData = await featuredResponse.json()

        // Fetch products by categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()

        const tabsData: Tab[] = [
          {
            id: "featured",
            label: "Featured",
            icon: <Star className="h-4 w-4 sm:h-5 sm:w-5" />,
            products: featuredData.success
              ? featuredData.products.slice(0, 20).map((product: any) => ({
                  ...product,
                  image: getFirstProductImage(product),
                }))
              : [],
          },
        ]

        // Add category tabs
        if (categoriesData.success && categoriesData.categories) {
          const categoryTabs = await Promise.all(
            categoriesData.categories.slice(0, 3).map(async (category: any) => {
              try {
                const response = await fetch(`/api/products?category=${category.slug}&limit=20`)
                const data = await response.json()

                return {
                  id: category.slug,
                  label: category.name,
                  icon: (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full"></div>
                  ),
                  products: data.success
                    ? data.products.slice(0, 20).map((product: any) => ({
                        ...product,
                        image: getFirstProductImage(product),
                      }))
                    : [],
                }
              } catch (error) {
                console.error(`Error fetching products for ${category.name}:`, error)
                return {
                  id: category.slug,
                  label: category.name,
                  icon: (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full"></div>
                  ),
                  products: [],
                }
              }
            }),
          )

          tabsData.push(...categoryTabs)
        }

        setTabs(tabsData)
        if (tabsData.length > 0) {
          setActiveTab(tabsData[0].id)
        }
      } catch (error) {
        console.error("Error fetching tab products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTabProducts()
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

  const nextProducts = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevProducts = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
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
        category: product.category || "furniture",
      })
    }
  }

  // Reset index when tab changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab])

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Animation */}
        <div
          className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">Products</span>
          </h2>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl sm:max-w-3xl mx-auto">
            Discover our curated collection of premium furniture
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Responsive Tabs */}
          <div
            className={`mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-gray-100 p-1 sm:p-2 rounded-xl">
                {tabs.map((tab, index) => (
                  <div key={tab.id} className="relative group">
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center justify-center space-x-0 sm:space-x-2 px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      {/* Icon only on mobile, icon + text on desktop */}
                      <span className="flex-shrink-0">{tab.icon}</span>
                      <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>

                      {/* Tooltip for mobile - shows on hover */}
                      <div className="sm:hidden absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {tab.label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div
            className={`space-y-6 sm:space-y-8 relative transition-all duration-1000 delay-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">Loading products...</div>
              </div>
            ) : !activeTabData || activeTabData.products.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">No products found</div>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`,
                    }}
                  >
                    {activeTabData.products.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex-shrink-0 px-2 sm:px-3"
                        style={{
                          width: `${100 / productsPerView}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      >
                        {/* Product Card */}
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
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                loading="lazy"
                              />
                            </Link>

                            {/* Sale/Stock Badges */}
                            <div className="absolute top-3 left-3 flex flex-col space-y-2">
                              {product.compare_price && product.compare_price > product.price && (
                                <Badge className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs">
                                  SALE
                                </Badge>
                              )}
                              {product.stock_quantity !== undefined &&
                                product.stock_quantity < 10 &&
                                product.stock_quantity > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    LOW STOCK
                                  </Badge>
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

                          {/* Product Info */}
                          <div className="text-center space-y-2">
                            <Link href={`/product/${product.id}`}>
                              <h3 className="font-medium text-gray-900 text-sm hover:text-[#C53D39] transition-colors cursor-pointer line-clamp-2">
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
                            {/* Rating - Only show if rating exists and > 0 */}
                            {product.average_rating && product.average_rating > 0 && (
                              <div className="flex items-center justify-center space-x-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(product.average_rating || 0)
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
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

                {/* Navigation Arrows */}
                {activeTabData.products.length > productsPerView && (
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={prevProducts}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={nextProducts}
                      disabled={currentIndex === maxIndex}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                )}
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
