"use client"

import { useState, useRef, useEffect } from "react"
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

interface ProductCarouselProps {
  products?: Product[]
  title?: string
  subtitle?: string
}

export function ProductCarousel({ title = "Best Seller Products", subtitle }: ProductCarouselProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

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

  // Fetch random products regardless of best seller status
  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Directly fetch from regular products API to get random products
      const response = await fetch(`/api/products?limit=20&sort=random`)
      const data = await response.json()

      if (data.success && data.products && data.products.length > 0) {
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
      } else {
        // Fallback: use random API if regular products API doesn't work
        const fallbackResponse = await fetch(`/api/products/random?tab=deals&limit=20`)
        const fallbackData = await fallbackResponse.json()

        if (fallbackData.success && fallbackData.products) {
          const transformedProducts = fallbackData.products.map((product: any) => {
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
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Load products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  // Simplified loading skeleton
  if (loading) {
    return (
      <div className="space-y-8 mt-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex space-x-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-1/4">
                  <div className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  // Create duplicated products for seamless loop
  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <div className="space-y-8 mt-16">
      {/* Section header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Products Container with infinite scroll animation */}
        <div
          ref={carouselRef}
          className="flex animate-scroll-right"
          style={{
            width: `${duplicatedProducts.length * 300}px`,
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="flex-shrink-0 w-[300px] px-3">
              <ProductCard product={product} onQuickView={handleQuickView} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />

      <style jsx>{`
        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${products.length * 300}px);
          }
        }
        
        .animate-scroll-right {
          animation: scroll-right 60s linear infinite;
        }
        
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
