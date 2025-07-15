"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"

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

const tabs = [
  { id: "deals", label: "Deal of the Day", icon: "🔥" },
  { id: "latest", label: "Latest", icon: "✨" },
  { id: "trending", label: "Trending", icon: "📈" },
  { id: "hot", label: "Hot Selling", icon: "🌟" },
]

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("deals")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [preloadedTabs, setPreloadedTabs] = useState<Set<string>>(new Set(["deals"]))

  // Optimized image parsing
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

  // Fetch products for a specific tab
  const fetchProducts = async (tab: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/random?tab=${tab}&limit=12`)
      const data = await response.json()

      if (data.success && data.products) {
        // Transform products with optimized processing
        const transformedProducts = data.products.map((product: any) => {
          const productImages = getProductImages(product.images)

          return {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.compare_price,
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

        setProducts(transformedProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Preload next tab for better UX
  const preloadNextTab = (currentTab: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === currentTab)
    const nextTab = tabs[(currentIndex + 1) % tabs.length]

    if (!preloadedTabs.has(nextTab.id)) {
      fetch(`/api/products/random?tab=${nextTab.id}&limit=12`)
        .then((res) => res.json())
        .then(() => {
          setPreloadedTabs((prev) => new Set([...prev, nextTab.id]))
        })
        .catch(() => {})
    }
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    fetchProducts(tab)
    preloadNextTab(tab)
  }

  // Load initial products
  useEffect(() => {
    fetchProducts(activeTab)
    preloadNextTab(activeTab)
  }, [])

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">Featured Products</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of premium furniture pieces</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
    </div>
  )
}
