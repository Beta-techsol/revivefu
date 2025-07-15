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
  compare_price?: number
  image: string
  images?: string[]
  hoverImage?: string
  description: string
  short_description?: string
  rating?: number
  average_rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  stock_quantity?: number
}

interface ProductCarouselProps {
  products?: Product[] // Make products optional since we'll fetch them
  title?: string
  subtitle?: string
  limit?: number
}

export function ProductCarousel({
  products: propProducts,
  title = "Best Seller Products",
  subtitle,
  limit = 8,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>(propProducts || [])
  const [loading, setLoading] = useState(!propProducts)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Fetch products from database if not provided as props
  useEffect(() => {
    if (!propProducts) {
      fetchProducts()
    }
  }, [propProducts])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/random?limit=${limit}&tab=carousel`)
      const data = await response.json()

      if (data.success && data.products) {
        // Transform products to match expected interface
        const transformedProducts = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.compare_price,
          compare_price: product.compare_price,
          image:
            product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg?height=300&width=300",
          images: product.images || [],
          hoverImage: product.images && product.images.length > 1 ? product.images[1] : undefined,
          description: product.description || product.short_description || "",
          short_description: product.short_description,
          rating: product.average_rating,
          average_rating: product.average_rating,
          isOnSale: product.compare_price && product.compare_price > product.price,
          isSoldOut: product.stock_quantity === 0,
          discount:
            product.compare_price && product.compare_price > product.price
              ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
              : undefined,
          stock_quantity: product.stock_quantity,
        }))

        setProducts(transformedProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      // Fallback to empty array on error
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

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

  // Loading skeleton
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

  // Don't render if no products
  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      {/* Carousel Container */}
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
