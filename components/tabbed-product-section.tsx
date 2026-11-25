"use client"
import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ChevronRight } from "lucide-react"

interface Product {
  id: string
  slug: string   // ✅ add this
  name: string
  price: number
  compare_price?: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  average_rating?: number
  review_count?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  images?: string[]
  stock_quantity?: number
}

interface Tab {
  id: string
  label: string
}

const tabs: Tab[] = [
  { id: "deals", label: "Deal of the Day" },
  { id: "latest", label: "Latest Furniture" },
  { id: "trending", label: "Trending Furniture" },
  { id: "hot", label: "Hot Selling" },
]

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("deals")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [productData, setProductData] = useState<Record<string, Product[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [animationKey, setAnimationKey] = useState(0)
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
  const fetchTabProducts = async (tabId: string) => {
    if (productData[tabId] && productData[tabId].length > 0) {
      return
    }

    setLoading((prev) => ({ ...prev, [tabId]: true }))

    try {
      const response = await fetch(`/api/products/random?tab=${tabId}&limit=7`)
      const data = await response.json()

      if (data.success && data.products) {
       const transformedProducts = data.products.map((product: any) => {
  const productImages = getProductImages(product.images)

  return {
    id: product.id,
    slug: product.slug, // ✅ include slug
    name: product.name,
    price: product.price,
    originalPrice: product.compare_price,
    image: productImages[0] || "/placeholder.svg?height=400&width=400",
    hoverImage: productImages[1] || productImages[0] || "/placeholder.svg?height=400&width=400",
    description: product.short_description || product.description || "",
    average_rating: product.average_rating || 0,   // ✅ keep this
    review_count: product.review_count || 0,       // ✅ add this
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

  // Load products for the active tab
  useEffect(() => {
    fetchTabProducts(activeTab)
  }, [activeTab])

  // Handle tab change with animation
  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId)
      setAnimationKey((prev) => prev + 1)
    }
  }

  const currentProducts = productData[activeTab] || []

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  // Get the active tab label
  const activeTabLabel = tabs.find((tab) => tab.id === activeTab)?.label || "Best Modern Furniture"

  return (
    <section
      ref={sectionRef}
      className={`py-[2%] bg-white transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ paddingLeft: "5%", paddingRight: "5%" }}
    >
      <div className="w-full">
        {loading[activeTab] ? (
          // Loading skeleton - 4 column grid
          <div className="space-y-6">
            {/* First row - Title column + 3 products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-100 animate-pulse rounded-lg h-80 w-full flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
              </div>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80 w-full"></div>
              ))}
            </div>
            {/* Second row - 4 products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-80 w-full"></div>
              ))}
            </div>
          </div>
        ) : (
          <div key={animationKey} className="space-y-6 animate-fade-in-up">
            {/* First row - Title/Tabs column + 3 products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* First Column - Title and Tabs */}
              <div className="flex flex-col justify-center bg-gray-50 p-6 rounded-lg min-h-[320px]">
                {/* Main Title */}
                <div className="mb-6">
                  <h2 className="text-2xl lg:text-3xl font-light text-gray-900 leading-tight mb-3">{activeTabLabel}</h2>
                  <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center group">
                    See All
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>

                {/* Vertical Tabs */}
                <div className="space-y-2">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium ${
                        activeTab === tab.id
                          ? "bg-gray-900 text-white shadow-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      } ${isVisible ? `animate-fade-in-up` : "opacity-0"}`}
                      style={{
                        animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Next 3 columns - Products */}
              {currentProducts.slice(0, 3).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <ProductCard product={product} onQuickView={handleQuickView} />
                </div>
              ))}

              {/* Fill empty slots if less than 3 products */}
              {currentProducts.length < 3 &&
                Array.from({ length: 3 - currentProducts.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                    <p className="text-gray-400">No product</p>
                  </div>
                ))}
            </div>

            {/* Second row - 4 products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.slice(3, 7).map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <ProductCard product={product} onQuickView={handleQuickView} />
                </div>
              ))}

              {/* Fill empty slots if less than 4 products in second row */}
              {currentProducts.length < 7 &&
                Array.from({ length: Math.min(4, 7 - Math.max(3, currentProducts.length)) }).map((_, index) => (
                  <div
                    key={`empty-row2-${index}`}
                    className="bg-gray-100 rounded-lg h-80 flex items-center justify-center"
                  >
                    <p className="text-gray-400">No product</p>
                  </div>
                ))}
            </div>

            {/* Show message if no products */}
            {currentProducts.length === 0 && (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-500 text-lg">No products available for this category</p>
              </div>
            )}
          </div>
        )}

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
