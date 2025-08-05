"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url: string
  rating?: number
  reviews_count?: number
  discount_percentage?: number
}

export function MostPopularProducts() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    days: 371,
    hours: 8,
    minutes: 5,
    seconds: 45,
  })

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/random?limit=9")
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

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(products.length / 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(products.length / 3)) % Math.ceil(products.length / 3))
  }

  const getVisibleProducts = () => {
    const startIndex = currentIndex * 3
    return products.slice(startIndex, startIndex + 3)
  }

  if (loading) {
    return (
      <section className="w-full py-12 bg-gray-50">
        <div className="px-[4%]">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="px-[4%]">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-normal text-gray-900 uppercase tracking-wide">
            MOST POPULAR PRODUCTS
          </h2>

          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              disabled={products.length <= 3}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dot indicator */}
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
              disabled={products.length <= 3}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[400px]">
          {/* Left Column - Flash Deals (40% width) */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              <Image src="/flash-deals-bg.avif" alt="Flash Deals Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
              {/* Top Content */}
              <div>
                <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold mb-4">
                  FLASH DEALS
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">DON'T MISS 70% OFF ALL SALE!</h3>
                <p className="text-lg font-medium">NO CODE NEEDED!</p>
              </div>

              {/* Bottom Content */}
              <div className="flex items-end justify-between">
                {/* Timer */}
                <div className="flex space-x-2">
                  <div className="bg-white text-black p-3 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{timeLeft.days}</div>
                    <div className="text-xs">Days</div>
                  </div>
                  <div className="bg-white text-black p-3 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.hours).padStart(2, "0")}</div>
                    <div className="text-xs">Hours</div>
                  </div>
                  <div className="bg-white text-black p-3 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.minutes).padStart(2, "0")}</div>
                    <div className="text-xs">Mins</div>
                  </div>
                  <div className="bg-white text-black p-3 rounded-md text-center min-w-[60px]">
                    <div className="text-xl font-bold">{String(timeLeft.seconds).padStart(2, "0")}</div>
                    <div className="text-xs">Sec</div>
                  </div>
                </div>

                {/* Shop Now Button */}
                <Button className="bg-white text-black hover:bg-gray-100 font-semibold px-6 py-2 rounded-md" asChild>
                  <Link href="/shop">Learn More →</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Products (60% width) */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {getVisibleProducts().map((product) => {
                const discount =
                  product.original_price && product.price
                    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                    : product.discount_percentage || 0

                return (
                  <Card
                    key={product.id}
                    className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {/* Discount Badge */}
                        {discount > 0 && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className="bg-lime-400 text-black px-2 py-1 text-xs font-semibold rounded flex items-center">
                              <span className="mr-1">⚡</span>-{discount}%
                            </div>
                          </div>
                        )}

                        <Image
                          src={product.image_url || "/placeholder.svg?height=300&width=300&text=Product"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4 bg-white">
                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < (product.rating || 5) ? "text-black fill-current" : "text-gray-300"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({product.reviews_count || 0})</span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-3 line-clamp-2">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">${product.price?.toFixed(2)}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ${product.original_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
