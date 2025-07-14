"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    mainImage: "/shop/hero-sofa-main.jpg",
    detailImage1: "/shop/hero-detail-1.jpg",
    detailImage2: "/shop/hero-detail-2.jpg",
    title: "LATEST",
    subtitle: "SOFA SET",
    description: "DESIGN",
  },
  {
    id: 2,
    mainImage: "/shop/products/bed-1.jpg",
    detailImage1: "/shop/products/chair-1.jpg",
    detailImage2: "/shop/products/coffee-table-1.jpg",
    title: "MODERN",
    subtitle: "BEDROOM",
    description: "COLLECTION",
  },
  {
    id: 3,
    mainImage: "/shop/products/dining-table-1.jpg",
    detailImage1: "/shop/products/wardrobe-1.jpg",
    detailImage2: "/shop/products/sofa-2.jpg",
    title: "PREMIUM",
    subtitle: "DINING",
    description: "FURNITURE",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

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

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gray-100">
      <div className="flex h-full">
        {/* Main Image - 60% */}
        <div className="relative w-[60%] h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                    ? "-translate-x-full"
                    : "translate-x-full"
              }`}
            >
              <Image
                src={slide.mainImage || "/placeholder.svg"}
                alt="Hero furniture"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Center Content Panel - 25% (Static) */}
        <div className="relative w-[25%] h-full bg-black text-white overflow-hidden">
          <div className="h-full flex flex-col justify-center px-8 py-8">
            {/* Animated Text Content */}
            <div className="relative h-24 mb-6">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-[-100%] opacity-0"
                  }`}
                >
                  <h3 className="text-sm font-light tracking-[0.2em] mb-2 text-left">{slide.title}</h3>
                  <h2 className="text-4xl font-bold tracking-wide mb-2 text-left leading-tight">{slide.subtitle}</h2>
                  <h3 className="text-lg font-light tracking-[0.15em] text-left">{slide.description}</h3>
                </div>
              ))}
            </div>

            {/* Animated Button with Branding Gradient */}
            <div className="relative h-12 overflow-hidden">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  className={`absolute w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm tracking-[0.1em] hover:from-amber-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    index === currentSlide ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{
                    transitionDelay: index === currentSlide ? "400ms" : "0ms",
                    transitionDuration: "700ms",
                  }}
                >
                  SHOP NOW
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows with Gradient Background */}
          <div className="absolute bottom-6 left-8 right-8 flex justify-between">
            {/* Left Arrow */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Detail Images - 15% */}
        <div className="w-[15%] h-full flex flex-col overflow-hidden">
          {/* Top Detail Image */}
          <div className="relative h-1/2 border-b border-gray-200 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={`detail1-${slide.id}`}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <Image src={slide.detailImage1 || "/placeholder.svg"} alt="Detail 1" fill className="object-cover" />
              </div>
            ))}
          </div>

          {/* Bottom Detail Image */}
          <div className="relative h-1/2 overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={`detail2-${slide.id}`}
                className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                  index === currentSlide ? "translate-x-0" : "translate-x-full"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <Image src={slide.detailImage2 || "/placeholder.svg"} alt="Detail 2" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
