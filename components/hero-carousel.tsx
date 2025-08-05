"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  price: string
  originalPrice?: string
  discount?: string
  image: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Office Chair",
    subtitle: "Ergonomic Design",
    description: "Experience ultimate comfort with our premium ergonomic office chair designed for long working hours.",
    price: "PKR 29,900",
    originalPrice: "PKR 39,900",
    discount: "25% OFF",
    image: "/hero/slide-1-chair.png",
  },
  {
    id: 2,
    title: "Modern Dining Table",
    subtitle: "Elegant & Functional",
    description: "Transform your dining space with our sleek modern dining table crafted from premium materials.",
    price: "PKR 89,900",
    originalPrice: "PKR 119,900",
    discount: "25% OFF",
    image: "/hero/slide-2-table.png",
  },
  {
    id: 3,
    title: "Luxury Armchair",
    subtitle: "Comfort Redefined",
    description: "Indulge in luxury with our handcrafted armchair featuring premium upholstery and superior comfort.",
    price: "PKR 59,900",
    originalPrice: "PKR 79,900",
    discount: "25% OFF",
    image: "/hero/slide-3-armchair.png",
  },
  {
    id: 4,
    title: "Wicker Accent Chair",
    subtitle: "Natural Beauty",
    description: "Add natural elegance to your space with our beautifully woven wicker accent chair.",
    price: "PKR 39,900",
    originalPrice: "PKR 49,900",
    discount: "20% OFF",
    image: "/hero/slide-4-wicker-chair.png",
  },
  {
    id: 5,
    title: "Classic Rocking Chair",
    subtitle: "Timeless Comfort",
    description: "Enjoy peaceful moments with our classic rocking chair, perfect for relaxation and reading.",
    price: "PKR 44,900",
    originalPrice: "PKR 59,900",
    discount: "25% OFF",
    image: "/hero/slide-5-rocking-chair.png",
  },
  {
    id: 6,
    title: "Modern Bench",
    subtitle: "Versatile Seating",
    description: "Maximize your space with our versatile modern bench, perfect for entryways and dining areas.",
    price: "PKR 19,900",
    originalPrice: "PKR 29,900",
    discount: "33% OFF",
    image: "/hero/slide-6-bench.png",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] lg:min-h-[700px] py-12">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Discount Badge with Float Animation */}
            {currentSlideData.discount && (
              <div className="animate-float-delayed">
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                  🔥 {currentSlideData.discount}
                </Badge>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-sm lg:text-base font-dancing-script text-gray-600 text-2xl">
                {currentSlideData.subtitle}
              </h2>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">{currentSlideData.title}</h1>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">{currentSlideData.description}</p>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">{currentSlideData.price}</span>
              {currentSlideData.originalPrice && (
                <span className="text-xl lg:text-2xl text-gray-500 line-through">{currentSlideData.originalPrice}</span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Product Image with Float Animation */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="relative animate-float">
              {/* Shadow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
                <Image src="/hero/shadow.png" alt="Shadow" width={500} height={125} className="opacity-20" />
              </div>

              {/* Product Image - Increased Size */}
              <div className="relative z-10">
                <Image
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  width={700}
                  height={700}
                  className="w-full h-auto max-w-lg lg:max-w-2xl object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vertical Pagination on Right */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-6">
        {/* Connecting Lines */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 opacity-30 transform -translate-x-1/2"></div>

        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center font-semibold text-sm z-10 ${
              index === currentSlide
                ? "bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white shadow-lg scale-110"
                : "bg-white/70 text-gray-600 border border-gray-300 hover:bg-white/90 hover:border-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}
