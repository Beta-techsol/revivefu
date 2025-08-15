"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
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
    image: "/new-arrivals/off.png",
  },
  {
    id: 2,
    title: "Emerald Velvet Bed",
    subtitle: "Sophisticated Style",
    description: "Add a touch of elegance to your bedroom with our luxurious emerald velvet upholstered bed.",
    image: "/hero/gbed.png",
  },
  {
    id: 3,
    title: "Contemporary Sofa Set",
    subtitle: "Modern Living",
    description: "Create the perfect living space with our stylish and comfortable contemporary sofa collection.",
    image: "/hero/sofa.png",
  },
  {
    id: 4,
    title: "Luxury Leather Bed",
    subtitle: "Premium Comfort",
    description: "Experience ultimate luxury with our handcrafted leather bed featuring elegant tufted headboard design.",
    image: "/hero/bbed.png",
  },
  {
    id: 5,
    title: "Classic Office Tables",
    subtitle: "Timeless Comfort",
    description: "Enjoy peaceful moments with our classic Office Table, perfect Quality and best for reading.",
    image: "/new-arrivals/ot.png",
  },
  {
    id: 6,
    title: "Luxury Armchair",
    subtitle: "Comfort Redefined",
    description: "Indulge in luxury with our handcrafted armchair featuring premium upholstery and superior comfort.",
    price: "PKR 59,900",
    originalPrice: "PKR 79,900",
    discount: "25% OFF",
    image: "/hero/slide-3-armchair.png",
  },
  {
    id: 7,
    title: "Modern Work Stations",
    subtitle: "Versatile Seating",
    description: "Maximize your space with our versatile modern Work Stations, perfect for Offices and Personal space.",
    image: "/new-arrivals/ws.png",
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
            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-sm lg:text-base font-dancing-script text-gray-600 text-2xl">
                {currentSlideData.subtitle}
              </h2>
              <h1 className="text-4xl lg:text-6xl font-semibold text-gray-900 leading-tight">{currentSlideData.title}</h1>
            </div>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">{currentSlideData.description}</p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white px-8 py-4 text-lg font-semibold rounded-[7px] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-[7px] transition-all duration-300 bg-transparent"
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
                <Image src="/hero/shadow.png" alt="Shadow" width={500} height={225} className="opacity-20" />
              </div>

              {/* Product Image - Increased Size */}
              <div className="relative z-10">
                <Image
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  width={700}
                  height={800}
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
