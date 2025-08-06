"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  compare_price?: number
  image_url?: string | string[]
  images?: string | string[]
  rating?: number
  average_rating?: number
  reviews_count?: number
  discount_percentage?: number
  description?: string
  short_description?: string
  category?: string
  material?: string
  color?: string
  brand?: string
  in_stock?: boolean
  stock_quantity?: number
}

export function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Parse and normalize image data
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

  // Transform backend product to frontend format
  const transformProduct = (product: any) => {
    // Try both 'images' and 'image_url' fields to match the API response
    const imageData = product.images || product.image_url
    const productImages = getProductImages(imageData)

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price || product.compare_price,
      image: productImages[0] || "/placeholder.svg?height=400&width=400",
      hoverImage: productImages[1] || productImages[0] || "/placeholder.svg?height=400&width=400",
      rating: product.rating || product.average_rating || 5,
      reviews: product.reviews_count || 0,
      description: product.description || product.short_description,
      category: product.category,
      material: product.material,
      color: product.color,
      brand: product.brand,
      inStock: product.in_stock !== false && (product.stock_quantity || 0) > 0,
      isOnSale: (product.original_price && product.original_price > product.price) || 
              (product.compare_price && product.compare_price > product.price),
      discount:
        product.original_price && product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : product.compare_price && product.price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : product.discount_percentage || 0,
      images: productImages,
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=9&sort=newest")
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-12 bg-white">
        <div className="px-[4%]">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading new arrivals...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 bg-white">
      <div className="px-[4%]">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900 uppercase tracking-wide">
            NEW ARRIVALS
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sticky Left Column - 40% */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-1/2 lg:-translate-y-1/2">
              <div className="relative rounded-lg overflow-hidden h-[600px]">
                <div className="absolute inset-0">
                  <Image 
                    src="/sticky.avif" 
                    alt="Coffee Table Set Background" 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-sm font-medium mb-2 opacity-90">
                      COFFEE TABLE SET
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                      THE PERFECT PAIRING<br />
                      FOR RELAXED MOMENTS
                    </h3>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors" 
                      asChild
                    >
                      <Link href="/shop?category=coffee-tables">
                        Learn More →
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Products Grid - 60% */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.slice(0, 9).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={transformProduct(product)} />
                </div>
              ))}
            </div>
            
            {/* Show More Button */}
            {products.length > 9 && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  className="px-8 py-3 border-gray-300 hover:bg-gray-50"
                  asChild
                >
                  <Link href="/shop?filter=new-arrivals">
                    View All New Arrivals
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
