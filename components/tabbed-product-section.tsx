"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ChevronLeft, ChevronRight, Flame, Clock, TrendingUp, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  rating?: number
  average_rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  images?: string[]
  stock_quantity?: number
}

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: Tab[] = [
  { id: "deals", label: "Deal of the Day", icon: Flame },
  { id: "latest", label: "Latest Furniture", icon: Clock },
  { id: "trending", label: "Trending Furniture", icon: TrendingUp },
  { id: "hot", label: "Hot Selling", icon: Star },
]

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("deals")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [productData, setProductData] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
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

  // Optimized image parsing - faster and more efficient
  const getProductImages = (images: string | string[]) => {
    if (!images) return []

    if (typeof images === "string") {
      if (images.startsWith("[") || images.startsWith("{")) {
        try {
          const parsed = JSON.parse(images)
          return Array.isArray(parsed) ? parsed.filter(Boolean) : []
        } catch {
          return []
        }
      }
      return [images]
    }
    return Array.isArray(images) ? images.filter(Boolean) : []
  }

  // Fetch products for a specific tab - optimized for speed
  const fetchTabProducts = async (tabId: string) => {
    if (productData[tabId] && productData[tabId].length > 0) {
      return // Already loaded
    }

    setLoading((prev) => ({ ...prev, [tabId]: true }))

    try {
      // Reduced limit for faster loading
      const response = await fetch(`/api/products/random?tab=${tabId}&limit=12`)
      const data = await response.json()

      if (data.success && data.products) {
        // Optimized transformation - minimal processing
        const transformedProducts = data.products.map((product: any) => {
          const productImages = getProductImages(product.images)

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price,
            // Use first image immediately, no complex fallbacks
            image: productImages[0] || "/placeholder.svg?height=400&width=400",
            hoverImage: productImages[1] || productImages[0] || "/placeholder.svg?height=400&width=400",
            description: product.short_description || product.description || "",
            rating: product.average_rating || 0,
            average_rating: product.average_rating || 0,
            stock_quantity: product.stock_quantity || 0,
            isSoldOut: product.stock_quantity === 0,
            isOnSale: !!product.compare_price && product.compare_price > product.price,
            images: productImages,
          }
        })

        setProductData((prev) => ({
          ...prev,
          [tabId]: transformedProducts,
        }))
      }
    } catch (error) {
      console.error(`Error fetching products for tab ${tabId}:`, error)
      setProductData((prev) => ({
        ...prev,
        [tabId]: [],
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [tabId]: false }))
    }
  }

  // Load products for the active tab immediately
  useEffect(() => {
    fetchTabProducts(activeTab)
  }, [activeTab])

  // Only preload other tabs when visible - not all at once
  useEffect(() => {
    if (isVisible) {
      // Preload only the next tab to reduce initial load
      const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
      const nextTab = tabs[(currentTabIndex + 1) % tabs.length]
      if (nextTab) {
        setTimeout(() => fetchTabProducts(nextTab.id), 500)
      }
    }
  }, [isVisible, activeTab])

  // Reset carousel index when tab changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab])

  const currentProducts = productData[activeTab] || []

  // Number of products to show per view (responsive)
  const getProductsPerView = () => {
    if (typeof window === "undefined") return 4
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 768) return 2
    if (window.innerWidth < 1024) return 3
    return 4
  }

  const [productsPerView, setProductsPerView] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      setProductsPerView(getProductsPerView())
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, currentProducts.length - productsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
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

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-white transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 transform
          ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-105 shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
          } 
          ${isVisible ? `animate-fade-in-up` : "opacity-0"}
          
          /* Mobile: Show only icons with tooltip */
          sm:px-6 px-3 sm:gap-3 gap-0 relative
        `}
                style={{
                  animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
                title={tab.label} // Tooltip for mobile
              >
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeTab === tab.id ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                {/* Text hidden on mobile, shown on sm and up */}
                <span className="font-medium hidden sm:inline">{tab.label}</span>

                {/* Tooltip for mobile */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap sm:hidden">
                  {tab.label}
                </div>
              </button>
            )
          })}
        </div>

        {/* Product Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {currentProducts.length > productsPerView && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
                onClick={prevSlide}
                disabled={currentIndex === 0 || loading[activeTab]}
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
                onClick={nextSlide}
                disabled={currentIndex === maxIndex || loading[activeTab]}
              >
                <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </Button>
            </>
          )}

          {/* Products Container */}
          <div className="overflow-hidden mx-12">
            {loading[activeTab] ? (
              // Simplified loading skeleton
              <div className="flex gap-6">
                {Array.from({ length: productsPerView }).map((_, index) => (
                  <div key={index} className="flex-shrink-0" style={{ width: `${100 / productsPerView}%` }}>
                    <div className="bg-gray-200 animate-pulse rounded-lg h-80 w-full"></div>
                  </div>
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`,
                }}
              >
                {currentProducts.map((product) => (
                  <div key={product.id} className="flex-shrink-0 px-3" style={{ width: `${100 / productsPerView}%` }}>
                    <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
                ))}
              </div>
            ) : (
              // No products message
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-500 text-lg">No products available for this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick View Modal */}
        <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
