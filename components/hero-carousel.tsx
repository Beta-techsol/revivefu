"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Premium Office Chair",
    subtitle: "natural beauty",
    description: "Experience ultimate comfort with our ergonomic design",
    price: "PKR 45,999",
    originalPrice: "PKR 59,999",
    image: "/hero/slide-1-chair.png",
    bgColor: "white",
  },
  {
    id: 2,
    title: "Modern Dining Table",
    subtitle: "elegant design",
    description: "Transform your dining space with contemporary style",
    price: "PKR 89,999",
    originalPrice: "PKR 109,999",
    image: "/hero/slide-2-table.png",
    bgColor: "white",
  },
  {
    id: 3,
    title: "Luxury Armchair",
    subtitle: "comfort redefined",
    description: "Sink into luxury with our premium upholstered armchair",
    price: "PKR 67,999",
    originalPrice: "PKR 84,999",
    image: "/hero/slide-3-armchair.png",
    bgColor: "white",
  },
  {
    id: 4,
    title: "Wicker Accent Chair",
    subtitle: "rustic charm",
    description: "Add natural texture to your space with handwoven design",
    price: "PKR 34,999",
    originalPrice: "PKR 44,999",
    image: "/hero/slide-4-wicker-chair.png",
    bgColor: "white",
  },
  {
    id: 5,
    title: "Classic Rocking Chair",
    subtitle: "timeless comfort",
    description: "Relax in style with our traditional rocking chair",
    price: "PKR 52,999",
    originalPrice: "PKR 69,999",
    image: "/hero/slide-5-rocking-chair.png",
    bgColor: "white",
  },
  {
    id: 6,
    title: "Modern Bench",
    subtitle: "versatile seating",
    description: "Perfect for entryways, bedrooms, or dining spaces",
    price: "PKR 28,999",
    originalPrice: "PKR 36,999",
    image: "/hero/slide-6-bench.png",
    bgColor: "white",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden">
      {/* Main Carousel Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between h-full max-w-7xl mx-auto px-8">
              {/* Content Section */}
              <div className="flex-1 max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-dancing-script text-orange-500 mb-2">{slide.subtitle}</h3>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">{slide.title}</h1>
                  </div>

                  <p className="text-xl text-gray-600 max-w-lg">{slide.description}</p>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-gray-900">{slide.price}</span>
                    <span className="text-xl text-gray-500 line-through">{slide.originalPrice}</span>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex-1 flex justify-center items-center">
                <div className="relative">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    width={700}
                    height={700}
                    className="max-w-2xl w-full h-auto object-contain drop-shadow-2xl"
                    priority={index === currentSlide}
                  />
                  {/* Shadow */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-3/4 h-8 bg-black/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Vertical Pagination on Right */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6 z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          {slides.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-orange-500 scale-125" : "bg-white/60 hover:bg-white/80"
                }`}
              />
              {index < slides.length - 1 && <div className="w-px h-8 bg-white/30 my-3"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 z-10">
        <span className="text-sm font-medium text-gray-700">
          {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  )
}
