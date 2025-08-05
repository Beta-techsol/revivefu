"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSlide {
  id: string
  category: string
  title: string
  subtitle: string
  description: string
  price: string
  originalPrice?: string
  image: string
  buttonText: string
}

const heroSlides: HeroSlide[] = [
  {
    id: "accent-chair",
    category: "NEW ARRIVALS",
    title: "Chairs & Seating",
    subtitle: "You'll Love",
    description: "Designer chair styles for every space - Free Shipping",
    price: "PKR 89,999",
    originalPrice: "PKR 109,999",
    image: "/hero/modern-accent-chair.png",
    buttonText: "SHOP NOW",
  },
  {
    id: "dining-table",
    category: "FEATURED",
    title: "Dining Tables",
    subtitle: "Modern & Elegant",
    description: "Premium dining tables crafted for contemporary homes",
    price: "PKR 149,999",
    originalPrice: "PKR 179,999",
    image: "/hero/round-dining-table.jpeg",
    buttonText: "EXPLORE",
  },
  {
    id: "wicker-set",
    category: "COMFORT COLLECTION",
    title: "Lounge Sets",
    subtitle: "Natural Beauty",
    description: "Handcrafted wicker furniture for relaxation and style",
    price: "PKR 124,999",
    originalPrice: "PKR 149,999",
    image: "/hero/wicker-chair-set.avif",
    buttonText: "DISCOVER",
  },
  {
    id: "expandable-table",
    category: "SMART FURNITURE",
    title: "Expandable Tables",
    subtitle: "Space Solutions",
    description: "Innovative designs that adapt to your lifestyle needs",
    price: "PKR 199,999",
    originalPrice: "PKR 239,999",
    image: "/hero/expandable-dining-table.png",
    buttonText: "VIEW MORE",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section
      className="relative min-h-screen w-full bg-gray-50 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          {/* Left Content */}
          <div className="order-2 lg:order-1 space-y-6 lg:space-y-8">
            {/* Category */}
            <div className="overflow-hidden">
              <p
                key={`category-${currentSlide}`}
                className="text-sm lg:text-base font-medium text-gray-600 tracking-wider uppercase animate-[slideInFromLeft_0.6s_ease-out_0.1s_both]"
              >
                {currentSlideData.category}
              </p>
            </div>

            {/* Main Title */}
            <div className="overflow-hidden">
              <h1
                key={`title-${currentSlide}`}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight animate-[slideInFromLeft_0.8s_ease-out_0.2s_both]"
              >
                {currentSlideData.title}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="overflow-hidden">
              <h2
                key={`subtitle-${currentSlide}`}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight animate-[slideInFromLeft_0.8s_ease-out_0.3s_both]"
              >
                {currentSlideData.subtitle}
              </h2>
            </div>

            {/* Description */}
            <div className="overflow-hidden">
              <p
                key={`description-${currentSlide}`}
                className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg animate-[slideInFromLeft_0.8s_ease-out_0.4s_both]"
              >
                {currentSlideData.description}
              </p>
            </div>

            {/* Price */}
            <div className="overflow-hidden">
              <div
                key={`price-${currentSlide}`}
                className="flex items-center gap-4 animate-[slideInFromLeft_0.8s_ease-out_0.5s_both]"
              >
                <span className="text-2xl lg:text-3xl font-bold text-[#C53D39]">{currentSlideData.price}</span>
                {currentSlideData.originalPrice && (
                  <span className="text-lg lg:text-xl text-gray-400 line-through">
                    {currentSlideData.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="overflow-hidden">
              <Button
                key={`button-${currentSlide}`}
                className="bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 text-base lg:text-lg rounded-none border-b-2 border-black hover:border-gray-800 transition-all duration-300 animate-[slideInFromLeft_0.8s_ease-out_0.6s_both]"
                style={{ textDecoration: "underline", textUnderlineOffset: "4px" }}
              >
                {currentSlideData.buttonText}
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] w-full">
              <Image
                key={`image-${currentSlide}`}
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                fill
                className="object-contain animate-[slideInFromRight_1s_ease-out_0.3s_both]"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 left-4 lg:left-8 z-20 flex gap-3">
        <button
          onClick={prevSlide}
          className="group flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={nextSlide}
          className="group flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200 hover:bg-gray-50 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700 group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-black" : "w-2 bg-gray-400 hover:bg-gray-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
