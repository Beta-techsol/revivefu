"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { ChevronLeft, ChevronRight, Share2, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  features: string[]
  category: string
  url: string
}

const products: Product[] = [
  {
    id: "331",
    name: "Luxury Bedroom Set",
    price: 125000,
    originalPrice: 150000,
    image: "/products/luxury-bedroom-set.webp",
    description: "Premium bedroom furniture set with modern design and superior comfort",
    features: ["Premium Quality Materials", "Modern Ergonomic Design", "Easy Assembly Process", "5 Year Warranty"],
    category: "Bedroom",
    url: "/product/331",
  },
  {
    id: "271",
    name: "Modern Dining Chair",
    price: 18500,
    originalPrice: 22000,
    image: "/products/modern-dining-chair.webp",
    description: "Contemporary dining chair with exceptional comfort and style",
    features: ["Ergonomic Back Support", "Durable Construction", "Easy to Clean Surface", "Stackable Design"],
    category: "Dining",
    url: "/product/271",
  },
  {
    id: "325",
    name: "Executive Office Desk",
    price: 95000,
    originalPrice: 110000,
    image: "/products/executive-office-desk.webp",
    description: "Professional office desk designed for productivity and elegance",
    features: ["Spacious Work Surface", "Built-in Cable Management", "Premium Wood Finish", "Adjustable Height"],
    category: "Office",
    url: "/product/325",
  },
]

export function ProductsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { addItem } = useCart()

  const currentProduct = products[currentIndex]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
    setIsAutoPlaying(false)
  }

  const handleOrderNow = () => {
    try {
      addItem({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        quantity: 1,
      })
      toast.success(`${currentProduct.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: currentProduct.name,
          text: currentProduct.description,
          url: `${window.location.origin}${currentProduct.url}`,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}${currentProduct.url}`)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast.error("Failed to share")
    }
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px] md:min-h-[600px]">
            {/* Left Side - Product Showcase */}
            <div className="lg:col-span-3 relative bg-gradient-to-br from-[#C53D39] via-[#D4574F] to-[#F1BA69] p-8 md:p-12 flex flex-col justify-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 border border-white/30 rounded-full"></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 border border-white/30 rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-white">
                <div className="mb-6">
                  <h1 className="text-4xl md:text-6xl font-bold mb-2">Deluxe</h1>
                  <p className="text-lg md:text-xl opacity-90 max-w-md">Attention to Function and Aesthetics</p>
                </div>

                {/* Large Number */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
                  <span className="text-[200px] md:text-[300px] font-bold leading-none">
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative mt-8 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image
                      src={currentProduct.image || "/placeholder.svg"}
                      alt={currentProduct.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setIsAutoPlaying(false)
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Card */}
            <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center bg-white">
              <Card className="border-0 shadow-none">
                <div className="space-y-6">
                  {/* Product Name & Category */}
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">{currentProduct.category}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{currentProduct.name}</h2>
                  </div>

                  {/* Product Image */}
                  <div className="relative w-full h-48 md:h-56 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={currentProduct.image || "/placeholder.svg"}
                      alt={currentProduct.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {currentProduct.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl md:text-4xl font-bold text-gray-900">
                        ₨ {currentProduct.price.toLocaleString()}
                      </span>
                      {currentProduct.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ₨ {currentProduct.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {currentProduct.originalPrice && (
                      <p className="text-sm text-green-600 font-medium">
                        Save ₨ {(currentProduct.originalPrice - currentProduct.price).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleOrderNow}
                      className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E5A855] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      ORDER NOW
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                      <Link href={currentProduct.url}>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 hover:border-[#C53D39] hover:text-[#C53D39] transition-all duration-300 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </Link>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full border-gray-300 hover:border-[#C53D39] hover:text-[#C53D39] transition-all duration-300 bg-transparent"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
