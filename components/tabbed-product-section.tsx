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
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
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
  const [productData, setProductData] = useState<Record<string, Product[]>>({
    deals: [],
    latest: [],
    trending: [],
    hot: [],
  })
  const [loading, setLoading] = useState(true)
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

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Get current date for daily refresh logic
        const today = new Date().toDateString()
        const cacheKey = `tabbed-products-${today}`

        // Check if we have cached data for today
        const cachedData = localStorage.getItem(cacheKey)
        if (cachedData) {
          setProductData(JSON.parse(cachedData))
          setLoading(false)
          return
        }

        // Fetch all products from API
        const response = await fetch("/api/products?limit=100")
        const result = await response.json()

        if (result.success && result.data?.products) {
          const allProducts = result.data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price || undefined,
            image: product.images?.[0] || "/placeholder.jpg",
            hoverImage: product.images?.[1] || product.images?.[0] || "/placeholder.jpg",
            description: product.description || "",
            rating: product.rating || 4.5,
            isOnSale: product.original_price && product.original_price > product.price,
            isSoldOut: product.stock_quantity === 0,
            discount:
              product.original_price && product.original_price > product.price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : undefined,
          }))

          // Shuffle products with daily seed for consistent daily randomization
          const shuffleWithSeed = (array: Product[], seed: string) => {
            const shuffled = [...array]
            let hash = 0
            for (let i = 0; i < seed.length; i++) {
              const char = seed.charCodeAt(i)
              hash = (hash << 5) - hash + char
              hash = hash & hash // Convert to 32bit integer
            }

            for (let i = shuffled.length - 1; i > 0; i--) {
              hash = (hash * 9301 + 49297) % 233280
              const j = Math.floor((hash / 233280) * (i + 1))
              ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }
            return shuffled
          }

          // Create different product sets for each tab with intelligent selection
          const newProductData = {
            deals: shuffleWithSeed(
              allProducts.filter((p) => p.isOnSale || p.discount),
              `deals-${today}`,
            ).slice(0, 25),

            latest: shuffleWithSeed(
              allProducts.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()),
              `latest-${today}`,
            ).slice(0, 25),

            trending: shuffleWithSeed(
              allProducts.filter((p) => p.rating >= 4.5),
              `trending-${today}`,
            ).slice(0, 25),

            hot: shuffleWithSeed(
              allProducts.filter((p) => p.isOnSale || p.rating >= 4.7),
              `hot-${today}`,
            ).slice(0, 25),
          }

          // Fill remaining slots if needed
          Object.keys(newProductData).forEach((key) => {
            const tabKey = key as keyof typeof newProductData
            if (newProductData[tabKey].length < 25) {
              const remaining = shuffleWithSeed(allProducts, `${key}-fill-${today}`)
                .filter((p) => !newProductData[tabKey].find((existing) => existing.id === p.id))
                .slice(0, 25 - newProductData[tabKey].length)
              newProductData[tabKey] = [...newProductData[tabKey], ...remaining]
            }
          })

          setProductData(newProductData)

          // Cache data for today
          localStorage.setItem(cacheKey, JSON.stringify(newProductData))

          // Clean up old cache entries
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("tabbed-products-") && key !== cacheKey) {
              localStorage.removeItem(key)
            }
          })
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Reset carousel index when tab changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab])

  const currentProducts = productData[activeTab as keyof typeof productData] || []

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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C53D39]"></div>
          </div>
        </div>
      </section>
    )
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
                className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 transform ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-105 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                } ${isVisible ? `animate-fade-in-up` : "opacity-0"}`}
                style={{
                  animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeTab === tab.id ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Product Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </Button>

          {/* Products Container */}
          <div className="overflow-hidden mx-12">
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
