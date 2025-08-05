"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  discount?: string
  buttonText: string
  buttonLink: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Office Chair",
    subtitle: "Ergonomic Design",
    description: "Experience ultimate comfort with our premium ergonomic office chair designed for long working hours.",
    image: "/hero/slide-1-chair.png",
    discount: "25% OFF",
    buttonText: "Shop Now",
    buttonLink: "/category/office-chairs",
  },
  {
    id: 2,
    title: "Modern Dining Table",
    subtitle: "Family Gatherings",
    description: "Create memorable moments with our beautifully crafted modern dining table for your family.",
    image: "/hero/slide-2-table.png",
    discount: "30% OFF",
    buttonText: "Explore",
    buttonLink: "/category/dining-tables",
  },
  {
    id: 3,
    title: "Luxury Armchair",
    subtitle: "Comfort & Style",
    description: "Relax in style with our luxury armchair that combines comfort with sophisticated design.",
    image: "/hero/slide-3-armchair.png",
    discount: "20% OFF",
    buttonText: "View Details",
    buttonLink: "/category/armchairs",
  },
  {
    id: 4,
    title: "Wicker Chair",
    subtitle: "Natural Beauty",
    description: "Bring natural elegance to your space with our handcrafted wicker chair collection.",
    image: "/hero/slide-4-wicker-chair.png",
    discount: "15% OFF",
    buttonText: "Shop Collection",
    buttonLink: "/category/wicker-chairs",
  },
  {
    id: 5,
    title: "Rocking Chair",
    subtitle: "Timeless Comfort",
    description: "Experience timeless comfort with our classic rocking chair perfect for relaxation.",
    image: "/hero/slide-5-rocking-chair.png",
    discount: "35% OFF",
    buttonText: "Buy Now",
    buttonLink: "/category/rocking-chairs",
  },
  {
    id: 6,
    title: "Modern Bench",
    subtitle: "Versatile Seating",
    description: "Add versatile seating to any room with our modern bench that combines style and functionality.",
    image: "/hero/slide-6-bench.png",
    discount: "40% OFF",
    buttonText: "Discover",
    buttonLink: "/category/benches",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="relative h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 z-10">
              {/* Discount Badge */}
              {heroSlides[currentSlide].discount && (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded-full text-sm font-semibold animate-pulse">
                  🔥 {heroSlides[currentSlide].discount} Limited Time
                </div>
              )}

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <h2 className="text-2xl lg:text-3xl font-medium text-gray-600">{heroSlides[currentSlide].subtitle}</h2>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">{heroSlides[currentSlide].description}</p>

              {/* CTA Button */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E5A85C] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {heroSlides[currentSlide].buttonText}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative flex justify-center items-center">
              {/* Shadow */}
              <div className="absolute bottom-0 w-96 h-24 bg-black/10 rounded-full blur-2xl"></div>

              {/* Product Image */}
              <div className="relative w-full max-w-2xl h-96 lg:h-[500px]">
                <Image
                  src={heroSlides[currentSlide].image || "/placeholder.svg"}
                  alt={heroSlides[currentSlide].title}
                  fill
                  className="object-contain drop-shadow-2xl transition-all duration-700 ease-in-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Percentage Circle */}
              <div className="absolute top-8 left-8 w-28 h-28 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {heroSlides[currentSlide].discount?.replace(" OFF", "") || "25%"}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Slide Indicators - Vertical on Right */}
      <div className="absolute right-16 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-20">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300/30 transform -translate-x-1/2"></div>

        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              currentSlide === index
                ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] border-transparent"
                : "bg-white/80 border-gray-300 hover:border-gray-400"
            }`}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${
                currentSlide === index ? "text-white" : "text-gray-600"
              }`}
            >
              {index + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / heroSlides.length) * 100}%` }}
        ></div>
      </div>
    </section>
  )
}
