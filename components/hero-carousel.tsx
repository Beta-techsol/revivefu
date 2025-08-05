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
  bgColor: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Office Chair",
    subtitle: "Ergonomic Design",
    description: "Experience ultimate comfort with our premium ergonomic office chair designed for long working hours.",
    price: "$299",
    originalPrice: "$399",
    discount: "25% OFF",
    image: "/hero/slide-1-chair.png",
    bgColor: "from-blue-50 to-indigo-100",
  },
  {
    id: 2,
    title: "Modern Dining Table",
    subtitle: "Elegant & Functional",
    description: "Transform your dining space with our sleek modern dining table crafted from premium materials.",
    price: "$899",
    originalPrice: "$1199",
    discount: "25% OFF",
    image: "/hero/slide-2-table.png",
    bgColor: "from-amber-50 to-orange-100",
  },
  {
    id: 3,
    title: "Luxury Armchair",
    subtitle: "Comfort Redefined",
    description: "Indulge in luxury with our handcrafted armchair featuring premium upholstery and superior comfort.",
    price: "$599",
    originalPrice: "$799",
    discount: "25% OFF",
    image: "/hero/slide-3-armchair.png",
    bgColor: "from-emerald-50 to-green-100",
  },
  {
    id: 4,
    title: "Wicker Accent Chair",
    subtitle: "Natural Beauty",
    description: "Add natural elegance to your space with our beautifully woven wicker accent chair.",
    price: "$399",
    originalPrice: "$499",
    discount: "20% OFF",
    image: "/hero/slide-4-wicker-chair.png",
    bgColor: "from-rose-50 to-pink-100",
  },
  {
    id: 5,
    title: "Classic Rocking Chair",
    subtitle: "Timeless Comfort",
    description: "Enjoy peaceful moments with our classic rocking chair, perfect for relaxation and reading.",
    price: "$449",
    originalPrice: "$599",
    discount: "25% OFF",
    image: "/hero/slide-5-rocking-chair.png",
    bgColor: "from-purple-50 to-violet-100",
  },
  {
    id: 6,
    title: "Modern Bench",
    subtitle: "Versatile Seating",
    description: "Maximize your space with our versatile modern bench, perfect for entryways and dining areas.",
    price: "$199",
    originalPrice: "$299",
    discount: "33% OFF",
    image: "/hero/slide-6-bench.png",
    bgColor: "from-teal-50 to-cyan-100",
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
    <section
      className={`relative min-h-[600px] lg:min-h-[700px] bg-gradient-to-br ${currentSlideData.bgColor} overflow-hidden transition-all duration-1000`}
    >
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
              <h2 className="text-sm lg:text-base font-medium text-gray-600 uppercase tracking-wider">
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
                <Image src="/hero/shadow.png" alt="Shadow" width={400} height={100} className="opacity-20" />
              </div>

              {/* Product Image */}
              <div className="relative z-10">
                <Image
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  width={500}
                  height={500}
                  className="w-full h-auto max-w-md lg:max-w-lg object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 right-8 flex space-x-8">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center font-semibold text-sm ${
              index === currentSlide
                ? "bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white border-transparent shadow-lg scale-110"
                : "bg-white/80 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}
