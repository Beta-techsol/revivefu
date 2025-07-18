"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Share2, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  shortDescription: string
  features: string[]
  category: string
  productUrl: string
}

const featuredProducts: Product[] = [
  {
    id: "331",
    name: "Executive Office Desk",
    price: 89999,
    originalPrice: 109999,
    image: "/products/executive-office-desk.webp",
    description:
      "Transform your workspace with our premium executive office desk featuring elegant wood-grain finish and modern white metal frame.",
    shortDescription: "Premium workspace solution with modern design",
    features: ["Premium wood-grain finish", "Modern white metal frame", "Spacious work surface"],
    category: "Office Furniture",
    productUrl: "/product/331",
  },
  {
    id: "271",
    name: "Modern Dining Chair",
    price: 24999,
    originalPrice: 29999,
    image: "/products/modern-dining-chair.webp",
    description:
      "Elevate your dining experience with our contemporary quilted leather chair featuring ergonomic design and sleek black metal legs.",
    shortDescription: "Contemporary quilted leather dining chair",
    features: ["Quilted leather upholstery", "Ergonomic design", "Sleek black metal legs"],
    category: "Dining Room",
    productUrl: "/product/271",
  },
  {
    id: "325",
    name: "Luxury Bedroom Set",
    price: 299999,
    originalPrice: 349999,
    image: "/products/luxury-bedroom-set.webp",
    description:
      "Experience ultimate luxury with our exquisite bedroom furniture featuring golden accents, tufted headboard, and matching dresser.",
    shortDescription: "Exquisite bedroom furniture with golden accents",
    features: ["Golden accent details", "Tufted headboard design", "Matching dresser included"],
    category: "Bedroom",
    productUrl: "/product/325",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleShare = async (product: Product) => {
    const shareData = {
      title: product.name,
      text: product.shortDescription,
      url: `${window.location.origin}${product.productUrl}`,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareData.url)
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard",
      })
    }
  }

  const currentProduct = featuredProducts[currentSlide]

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-white">
      {/* Main Container */}
      <div className="relative w-full h-full">
        {/* Mobile Layout - Stacked */}
        <div className="block lg:hidden h-full">
          <div className="flex flex-col h-full">
            {/* Top Image Section - Mobile */}
            <div className="relative flex-1 bg-gradient-to-br from-gray-100 via-gray-50 to-white">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-[#C53D39] rounded-lg rotate-12"></div>
                <div className="absolute top-20 right-16 w-16 h-16 bg-[#F1BA69] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-16 w-12 h-12 border border-[#C53D39] rotate-45"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-6 text-center">
                {/* Brand Title */}
                <div className="mb-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Deluxe</h1>
                  <p className="text-lg text-gray-600 font-light">Attention to Function and Aesthetics</p>
                </div>

                {/* Product Image */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 mb-4">
                  <Image
                    src={currentProduct.image || "/placeholder.svg"}
                    alt={currentProduct.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Slide Number */}
                <div className="text-6xl md:text-7xl font-bold text-gray-200 absolute top-4 right-4">
                  {String(currentSlide + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Navigation Arrows - Mobile */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Bottom Product Card - Mobile */}
            <div className="bg-white p-6 border-t border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900">{currentProduct.name}</h3>
                <Link
                  href={currentProduct.productUrl}
                  className="text-sm text-[#F1BA69] hover:text-[#C53D39] font-medium transition-colors"
                >
                  Details
                </Link>
              </div>

              {/* Features */}
              <ul className="space-y-1 mb-4">
                {currentProduct.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-[#F1BA69] rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Price and Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">PKR {currentProduct.price.toLocaleString()}</span>
                  {currentProduct.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      PKR {currentProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => handleShare(currentProduct)} variant="outline" size="sm" className="px-3">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleAddToCart(currentProduct)}
                    className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E6A555] text-white px-6"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:grid lg:grid-cols-2 h-full">
          {/* Left Section - Product Showcase */}
          <div className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0">
              {/* Gradient Overlays */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#C53D39]/5 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[#F1BA69]/5 to-transparent rounded-full blur-3xl"></div>

              {/* Geometric Patterns */}
              <div className="absolute top-16 left-16 w-24 h-24 border-2 border-[#C53D39]/20 rounded-lg rotate-12"></div>
              <div className="absolute top-32 right-20 w-20 h-20 bg-[#F1BA69]/10 rounded-full"></div>
              <div className="absolute bottom-32 left-20 w-16 h-16 border border-[#C53D39]/15 rotate-45"></div>
              <div className="absolute bottom-16 right-32 w-12 h-12 bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-lg rotate-12"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center p-12">
              {/* Brand Section */}
              <div className="text-center mb-8">
                <h1 className="text-6xl xl:text-7xl font-bold text-gray-800 mb-4 tracking-tight">Deluxe</h1>
                <p className="text-xl text-gray-600 font-light max-w-md leading-relaxed">
                  Attention to Function and Aesthetics
                </p>
              </div>

              {/* Product Showcase */}
              <div className="relative">
                <div className="relative w-80 h-80 xl:w-96 xl:h-96">
                  <Image
                    src={currentProduct.image || "/placeholder.svg"}
                    alt={currentProduct.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Slide Number */}
              <div className="absolute top-8 right-8 text-8xl xl:text-9xl font-bold text-gray-200/50">
                {String(currentSlide + 1).padStart(2, "0")}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Section - Product Card */}
          <div className="bg-white flex items-center justify-center p-12">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 leading-tight">{currentProduct.name}</h2>
                <Link
                  href={currentProduct.productUrl}
                  className="text-[#F1BA69] hover:text-[#C53D39] font-medium transition-colors duration-300 text-sm"
                >
                  Details
                </Link>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-48 mb-6 bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={currentProduct.image || "/placeholder.svg"}
                  alt={currentProduct.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {currentProduct.features.map((feature, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-bold text-gray-900">PKR {currentProduct.price.toLocaleString()}</span>
                  {currentProduct.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      PKR {currentProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {currentProduct.originalPrice && (
                  <div className="mt-1">
                    <span className="inline-block bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs px-2 py-1 rounded-full">
                      Save PKR {(currentProduct.originalPrice - currentProduct.price).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleAddToCart(currentProduct)}
                  className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E6A555] text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  ORDER NOW
                </Button>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleShare(currentProduct)}
                    variant="outline"
                    className="flex-1 border-gray-300 hover:border-[#C53D39] hover:text-[#C53D39] transition-colors duration-300"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Link href={currentProduct.productUrl} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 hover:border-[#F1BA69] hover:text-[#F1BA69] transition-colors duration-300 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
