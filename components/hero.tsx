"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 1,
    image: "/products/modern-dining-chair.webp",
    category: "Modern",
    title: "Dining Chair",
    description: "Contemporary quilted leather chair with ergonomic design and sleek black metal legs",
    price: "24,999",
    originalPrice: "29,999",
    roomType: "DINING ROOM",
  },
  {
    id: 2,
    image: "/products/luxury-bedroom-set.webp",
    category: "Luxury",
    title: "Bedroom Set",
    description: "Premium bedroom furniture collection with modern design and premium materials",
    price: "89,999",
    originalPrice: "99,999",
    roomType: "BEDROOM",
  },
  {
    id: 3,
    image: "/products/executive-office-desk.webp",
    category: "Executive",
    title: "Office Desk",
    description: "Professional workspace solution with ample storage and contemporary styling",
    price: "45,999",
    originalPrice: "52,999",
    roomType: "OFFICE",
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleSlideChange((prev) => (prev + 1) % slides.length)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [isAnimating])

  const handleSlideChange = (newSlide: number | ((prev: number) => number)) => {
    if (isAnimating) return

    setIsAnimating(true)
    const nextSlide = typeof newSlide === "function" ? newSlide(currentSlide) : newSlide
    setCurrentSlide(nextSlide)

    setTimeout(() => setIsAnimating(false), 800)
  }

  const nextSlide = () => {
    handleSlideChange((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    handleSlideChange((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full bg-gray-50 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center min-h-[600px] gap-12">
            {/* Left Content - 50% */}
            <div className="flex-1 space-y-6">
              {/* Room Type Badge */}
              <div className="inline-block">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentSlideData.roomType}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-5xl font-light text-gray-800 font-dancing-script">{currentSlideData.category}</h2>
                <h1 className="text-6xl font-bold text-red-600 leading-tight">{currentSlideData.title}</h1>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">{currentSlideData.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-red-600">PKR {currentSlideData.price}</span>
                <span className="text-xl text-gray-400 line-through">PKR {currentSlideData.originalPrice}</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/shop"
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-center"
                >
                  Shop Now →
                </Link>
                <button className="border-2 border-red-500 text-red-500 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-500 hover:text-white transition-all duration-300">
                  View Details
                </button>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-4 pt-6">
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Right Image - 50% */}
            <div className="flex-1 relative">
              <div className="relative h-[500px] w-full">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                      index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95"
                    }`}
                  >
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="relative min-h-[700px] flex flex-col">
          {/* Image Section - Top Half */}
          <div className="relative h-[350px] w-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                  index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-contain bg-gray-50"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Room Type Badge - Positioned on image */}
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                {currentSlideData.roomType}
              </span>
            </div>
          </div>

          {/* Content Section - Bottom Half */}
          <div className="flex-1 px-6 py-8 bg-white">
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-1">
                <h2 className="text-3xl font-light text-gray-800 font-dancing-script">{currentSlideData.category}</h2>
                <h1 className="text-4xl font-bold text-red-600 leading-tight">{currentSlideData.title}</h1>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-base leading-relaxed">{currentSlideData.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-600">PKR {currentSlideData.price}</span>
                <span className="text-lg text-gray-400 line-through">PKR {currentSlideData.originalPrice}</span>
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-4">
                <Link
                  href="/shop"
                  className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-lg font-semibold text-center hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                >
                  Shop Now →
                </Link>
                <button className="block w-full border-2 border-red-500 text-red-500 px-6 py-4 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300">
                  View Details
                </button>
              </div>

              {/* Navigation Arrows - Positioned at bottom with proper spacing */}
              <div className="flex justify-center gap-4 pt-6 pb-4">
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="w-12 h-12 rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 lg:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-red-500 w-6" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
