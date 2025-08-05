"use client"

import { useState, useRef, useEffect } from "react"
import { QuickViewModal } from "./quick-view-modal"
import Image from "next/image"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  rating: number
  isOnSale?: boolean
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
  const [currentIndex, setCurrentIndex] = useState(0)

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
            discount: product.discount_percentage || 0,
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
              discount: product.discount_percentage || 0,
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

  // Create extended product array for infinite loop
  const extendedProducts = [...products, ...products, ...products]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(timer)
  }, [products.length])

  // Simplified loading skeleton
  if (loading) {
    return (
      <div className="w-full mt-16">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
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

  return (
    <section className="w-full py-16 bg-gray-50 mt-16 overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 mb-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        {subtitle && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 320}px)`,
            width: `${extendedProducts.length * 320}px`,
          }}
        >
          {extendedProducts.map((product, index) => (
            <div key={`${product.id}-${index}`} className="flex-shrink-0 w-80 mx-2 group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage || "/placeholder.svg"}
                      alt={`${product.name} hover`}
                      fill
                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  )}

                  {/* Sale Badge */}
                  {product.isOnSale && product.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">PKR {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          PKR {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-orange-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
    </section>
  )
}
