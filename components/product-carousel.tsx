"use client"

import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ArrowLeft, ArrowRight } from "lucide-react"

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

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?limit=20&sort=random`)
      const data = await response.json()

      if (data.success && data.products?.length > 0) {
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

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return
    const scrollAmount = 320
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="w-full mt-16">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex space-x-6 px-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-[300px]">
                <div className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!products?.length) return null

  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <div className="w-full my-[2%]">
      {/* Header with arrows */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 max-w-2xl">{subtitle}</p>}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden w-full group">
        <div
          ref={carouselRef}
          className="flex animate-scroll-right hover:[animation-play-state:paused] overflow-x-scroll scrollbar-hide"
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
      `}</style>
    </div>
  )
}
