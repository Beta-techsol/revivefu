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
  price?: string
  originalPrice?: string
  discount?: string
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
    image: "/hero/bbedd.png",
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
    image: "/new-arrivals/ws.jpg",
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
    <section className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] bg-white overflow-hidden">
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
        {/* Mobile Layout */}
        <div className="flex flex-col items-center text-center gap-4 sm:hidden py-8">
          <Image
            src={currentSlideData.image || "/placeholder.svg"}
            alt={currentSlideData.title}
            width={300}
            height={500}
            className={`object-contain ${
              currentSlideData.id === 1
                ? "h-[500px] w-auto" // custom fixed height
                : "h-full w-auto max-h-[380px]" // full height auto width
            }`}
            priority
          />

          <div className="space-y-2">
            <h2 className="text-sm font-dancing-script text-gray-600">{currentSlideData.subtitle}</h2>
            <h1 className="text-2xl font-semibold text-gray-900 leading-snug">{currentSlideData.title}</h1>
            <p className="text-base text-gray-600 max-w-sm mx-auto">{currentSlideData.description}</p>
          </div>

          <div className="flex justify-center gap-4 w-full">
            <Button className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white px-6 py-3 text-base font-semibold rounded-[7px] shadow-lg">
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 text-base font-semibold rounded-[7px]"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Desktop / Tablet Layout */}
        <div className="hidden sm:grid grid-cols-2 gap-8 items-center min-h-[500px] md:min-h-[600px] py-10">
          <div className="space-y-5 order-2 lg:order-1">
            <h2 className="text-sm md:text-base font-dancing-script text-gray-600">{currentSlideData.subtitle}</h2>
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-snug">{currentSlideData.title}</h1>
            <p className="text-base md:text-lg text-gray-600 max-w-md">{currentSlideData.description}</p>
            <div className="flex gap-4">
              <Button className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white px-8 py-4 text-lg font-semibold rounded-[7px] shadow-lg">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold rounded-[7px]"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex items-center justify-center">
            <div className="relative animate-float">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 hidden sm:block">
                <Image src="/hero/shadow.png" alt="Shadow" width={300} height={120} className="opacity-20 w-48 md:w-64" />
              </div>
              <Image
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                width={400}
                height={700}
                className={`object-contain relative z-10 ${
                  currentSlideData.id === 1
                    ? "h-[500px] w-auto" // custom fixed height
                    : "h-full w-auto max-h-[700px]" // full height auto width
                }`}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex-col space-y-4 hidden sm:flex">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
              index === currentSlide
                ? "bg-gradient-to-r from-[#C53D39] to-[#E85A4F] text-white shadow-lg scale-110"
                : "bg-white/70 text-gray-600 border border-gray-300 hover:bg-white/90"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </section>
  )
}
