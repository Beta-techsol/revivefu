"use client"

import { useState, useRef, useEffect } from "react"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface Product {
  slug: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  average_rating?: number
  review_count?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
}

interface ProductCarouselProps {
  products?: Product[] // legacy, unused in this change
  title?: string
  subtitle?: string
  prefetched?: any[] // allow server-passed raw API products
}

export function ProductCarousel({ title = "Best Seller Products", subtitle, prefetched }: ProductCarouselProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isPausedRef = useRef(false)

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

  const transformFromApi = (product: any): Product => {
    const productImages = getProductImages(product.images)
    return {
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: productImages[0] || "/placeholder.svg?height=400&width=400",
      hoverImage: productImages[1] || productImages[0] || "/placeholder.svg?height=400&width=400",
      description: product.short_description || product.description || "",
      average_rating: product.average_rating || 0,
      review_count: product.review_count || 0,
      isSoldOut: (product.stock_quantity || 0) === 0,
      isOnSale: !!product.compare_price && product.compare_price > product.price,
      discount: undefined,
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?limit=20&tab=trending`)
      const data = await response.json()

      if (data.success && data.products && data.products.length > 0) {
        const transformedProducts = data.products.map((p: any) => transformFromApi(p))
        setProducts(transformedProducts)
      } else {
        const fallbackResponse = await fetch(`/api/products/random?tab=deals&limit=20`)
        const fallbackData = await fallbackResponse.json()
        if (fallbackData.success && fallbackData.products) {
          const transformedProducts = fallbackData.products.map((p: any) => transformFromApi(p))
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

  useEffect(() => {
    const usePrefetched = Array.isArray(prefetched) && prefetched.length > 0
    if (usePrefetched) {
      setProducts((prefetched as any[]).map((p) => transformFromApi(p)))
      setLoading(false)
      return
    }
    fetchProducts()
  }, [prefetched])

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return
    let animationId = 0
    let scrollPosition = carousel.scrollLeft || 0
    const scrollSpeed = 0.8

    const animate = () => {
      if (!isPausedRef.current) {
        scrollPosition += scrollSpeed
        if (scrollPosition >= carousel.scrollWidth / 2) scrollPosition = 0
        carousel.scrollLeft = scrollPosition
      } else {
        scrollPosition = carousel.scrollLeft
      }
      animationId = requestAnimationFrame(animate)
    }

    if (!loading && products.length > 0) {
      animationId = requestAnimationFrame(animate)
    }
    return () => cancelAnimationFrame(animationId)
  }, [loading, products.length])

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  const scrollCarousel = (direction: "left" | "right") => {
    const carousel = carouselRef.current
    if (!carousel) return
    const scrollAmount = Math.round(carousel.clientWidth * 0.8)
    carousel.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  if (loading) {
    return (
      <div className="w-full mt-16">
        <div className="relative text-center space-y-4 mb-8">
          <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
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

  if (!products || products.length === 0) {
    return null
  }

  const duplicatedProducts = [...products, ...products, ...products]

  return (
    <div className="w-full my-[2%]">
      <div className="relative text-center space-y-4 mb-8">
        <h2 className="text-4xl font-medium text-gray-900">{title}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full"></div>
        {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}

        <div className="absolute right-0 top-0 flex gap-3 z-20">
          <button
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onClick={() => scrollCarousel("left")}
            aria-label="Scroll left"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onMouseEnter={() => (isPausedRef.current = true)}
            onMouseLeave={() => (isPausedRef.current = false)}
            onClick={() => scrollCarousel("right")}
            aria-label="Scroll right"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white transition-all duration-300"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden w-full">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto no-scrollbar"
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {duplicatedProducts.map((product, index) => (
            <div key={`${product.slug}-${index}`} className="flex-shrink-0 w-[300px] px-3">
              <ProductCard product={product} onQuickView={handleQuickView} />
            </div>
          ))}
        </div>
      </div>

      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />

      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
