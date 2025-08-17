"use client"

import { useState, useEffect, useRef } from "react"
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
  const [isForceSticky, setIsForceSticky] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const originalPositionRef = useRef<number>(0)
  const originalDimensionsRef = useRef<{ width: number; left: number }>({ width: 0, left: 0 })

  const checkStickyBehavior = () => {
    if (stickyRef.current && containerRef.current) {
      const stickyElement = stickyRef.current
      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const stickyRect = stickyElement.getBoundingClientRect()

      if (originalPositionRef.current === 0 && containerRect.top > 0) {
        originalPositionRef.current = containerRect.top + window.scrollY
        const stickyOriginalRect = stickyElement.getBoundingClientRect()
        originalDimensionsRef.current = {
          width: stickyOriginalRect.width,
          left: stickyOriginalRect.left,
        }
      }

      const sectionTop = originalPositionRef.current - 16
      const sectionBottom = originalPositionRef.current + containerRect.height - stickyElement.offsetHeight - 100
      const transitionZone = originalPositionRef.current + containerRect.height - stickyElement.offsetHeight - 32
      const currentScroll = window.scrollY

      const shouldBeSticky = currentScroll >= sectionTop && currentScroll <= sectionBottom
      const shouldTransition = currentScroll > sectionBottom && currentScroll <= transitionZone

      if (shouldBeSticky !== isForceSticky) {
        setIsForceSticky(shouldBeSticky)
      }

      if (shouldTransition !== isTransitioning) {
        setIsTransitioning(shouldTransition)
      }

      console.log("[v0] Force Sticky Debug:", {
        scrollY: currentScroll,
        originalPosition: originalPositionRef.current,
        sectionTop,
        sectionBottom,
        transitionZone,
        containerHeight: containerRect.height,
        shouldBeSticky,
        shouldTransition,
        isForceSticky,
        isTransitioning,
        originalDimensions: originalDimensionsRef.current,
      })
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

    setTimeout(() => {
      checkStickyBehavior()
    }, 100)

    window.addEventListener("scroll", checkStickyBehavior)
    window.addEventListener("resize", checkStickyBehavior)

    return () => {
      window.removeEventListener("scroll", checkStickyBehavior)
      window.removeEventListener("resize", checkStickyBehavior)
    }
  }, [isForceSticky, isTransitioning])

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

  const transformProduct = (product: any) => {
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
      isOnSale:
        (product.original_price && product.original_price > product.price) ||
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
    <section
      ref={containerRef}
      className="w-full py-12 bg-white relative"
      style={{ minHeight: "120vh", overflow: "visible" }}
    >
      <div className="px-[4%]">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900 uppercase tracking-wide">NEW ARRIVALS</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div
              ref={stickyRef}
              style={{
                position: isForceSticky ? "fixed" : isTransitioning ? "absolute" : "static",
                top: isForceSticky ? "16px" : isTransitioning ? "auto" : "auto",
                bottom: isTransitioning ? "100px" : "auto",
                left: isForceSticky ? `${originalDimensionsRef.current.left}px` : "auto",
                width: isForceSticky ? `${originalDimensionsRef.current.width}px` : "100%",
                zIndex: isForceSticky ? 9999 : 1,
                height: "fit-content",
                transform: "translateZ(0)",
              }}
            >
              <div className="relative rounded-lg overflow-hidden h-[600px]">
                <div className="absolute inset-0">
                  <Image src="/sticky.avif" alt="Coffee Table Set Background" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-sm font-medium mb-2 opacity-90">COFFEE TABLE SET</div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                      THE PERFECT PAIRING
                      <br />
                      FOR RELAXED MOMENTS
                    </h3>
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3 rounded-md transition-colors"
                      asChild
                    >
                      <Link href="/shop?category=coffee-tables">Learn More →</Link>
                    </Button>
                  </div>
                </div>
                <div
                  className={`absolute bottom-2 right-2 text-white text-xs px-2 py-1 rounded ${
                    isForceSticky ? "bg-green-500" : isTransitioning ? "bg-yellow-500" : "bg-red-500"
                  }`}
                >
                  {isForceSticky ? "STICKY ACTIVE" : isTransitioning ? "TRANSITIONING" : "Not Sticky"}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.slice(0, 9).map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={transformProduct(product)} />
                </div>
              ))}
            </div>

            {products.length > 9 && (
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8 py-3 border-gray-300 hover:bg-gray-50 bg-transparent" asChild>
                  <Link href="/shop?filter=new-arrivals">View All New Arrivals</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
