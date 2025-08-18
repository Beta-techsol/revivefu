"use client"

import { useState, useRef, useEffect } from "react"
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products?limit=20&sort=random`)
        const data = await response.json()
        if (data.success && data.products?.length > 0) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Auto scroll function
  const startAutoScroll = () => {
    stopAutoScroll()
    scrollIntervalRef.current = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollBy({ left: 1, behavior: "smooth" })
        if (
          carouselRef.current.scrollLeft + carouselRef.current.clientWidth >=
          carouselRef.current.scrollWidth
        ) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" })
        }
      }
    }, 30)
  }

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoScroll()
    return stopAutoScroll
  }, [products])

  const scrollLeft = () => {
    stopAutoScroll()
    carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    stopAutoScroll()
    carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" })
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
      <div className="w-full mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
        </div>
        <div className="flex space-x-6 px-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[300px]">
              <div className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!products.length) return null

  return (
    <div className="w-full my-[2%]">
      {/* Header with title + arrows */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full"></div>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        <div
          className="flex space-x-2"
          onMouseEnter={stopAutoScroll}
          onMouseLeave={startAutoScroll}
        >
          <button
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Scrollable carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-6 px-4 scrollbar-hide"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        {products.map((product, i) => (
          <div key={i} className="flex-shrink-0 w-[300px]">
            <ProductCard product={product} onQuickView={handleQuickView} />
          </div>
        ))}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </div>
  )
}
