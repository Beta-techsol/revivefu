"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Fetch products using the same logic as tabbed-product-section
  const fetchProducts = async () => {
    try {
      setLoading(true)
      console.log("ProductCarousel: Fetching products")
      const response = await fetch(`/api/products/random?tab=carousel&limit=25`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("ProductCarousel API response:", data)

      if (data.success && data.products) {
        // Transform products to match the expected interface
        const transformedProducts = data.products.map((product: any) => {
          // Helper function to safely parse images
          const getProductImages = (images: any) => {
            if (!images) return []
            if (typeof images === "string") {
              try {
                const parsed = JSON.parse(images)
                return Array.isArray(parsed) ? parsed.filter((img) => img && img.trim()) : []
              } catch {
                return []
              }
            }
            return Array.isArray(images) ? images.filter((img) => img && img.trim()) : []
          }

          const productImages = getProductImages(product.images)

          return {
            ...product,
            originalPrice: product.compare_price,
            image:
              productImages.length > 0
                ? productImages[0]
                : `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop`,
            hoverImage:
              productImages.length > 1
                ? productImages[1]
                : `https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop`,
            rating: product.average_rating || 4.5,
            isSoldOut: product.stock_quantity === 0,
            isOnSale: !!product.compare_price && product.compare_price > product.price,
            discount:
              product.compare_price && product.price
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                : 0,
          }
        })

        console.log(`ProductCarousel: Transformed ${transformedProducts.length} products`)
        setProducts(transformedProducts)
      } else {
        console.error("ProductCarousel: Failed to fetch products:", data.error)
        setProducts([])
      }
    } catch (error) {
      console.error("ProductCarousel: Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Load products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

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

  const maxIndex = Math.max(0, products.length - productsPerView)

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

  // Loading skeleton matching tabbed-product-section design
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="relative">
          <div className="overflow-hidden mx-12">
            <div className="flex space-x-6">
              {Array.from({ length: productsPerView }).map((_, index) => (
                <div key={index} className="flex-shrink-0" style={{ width: `${100 / productsPerView}%` }}>
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

  return (
    <div className="space-y-8">
      {/* Section header matching tabbed-product-section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      {/* Carousel Container matching tabbed-product-section */}
      <div className="relative">
        {/* Navigation Buttons */}
        {products.length > productsPerView && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#C53D39] hover:bg-white shadow-lg"
              onClick={prevSlide}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-[#C53D39] hover:bg-white shadow-lg"
              onClick={nextSlide}
              disabled={currentIndex === maxIndex}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Products Container */}
        <div className="overflow-hidden mx-12">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`,
            }}
          >
            {products.map((product) => (
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
  )
}
