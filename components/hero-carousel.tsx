"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeroSlide {
  id: string
  saleText: string
  title: string
  buttonText: string
  image: string
  discountPercentage: string
}

const heroSlides: HeroSlide[] = [
  {
    id: "office-chairs",
    saleText: "SALE UP TO 60% OFF",
    title: "Office Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-1-chair.png",
    discountPercentage: "60%",
  },
  {
    id: "dining-tables",
    saleText: "SALE UP TO 55% OFF",
    title: "Dining Tables",
    buttonText: "View Collection",
    image: "/hero/slide-2-table.png",
    discountPercentage: "55%",
  },
  {
    id: "armchairs",
    saleText: "SALE UP TO 70% OFF",
    title: "Luxury Armchairs",
    buttonText: "View Collection",
    image: "/hero/slide-3-armchair.png",
    discountPercentage: "70%",
  },
  {
    id: "wicker-furniture",
    saleText: "SALE UP TO 50% OFF",
    title: "Wicker Furniture",
    buttonText: "View Collection",
    image: "/hero/slide-4-wicker-chair.png",
    discountPercentage: "50%",
  },
  {
    id: "rocking-chairs",
    saleText: "SALE UP TO 65% OFF",
    title: "Rocking Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-5-rocking-chair.png",
    discountPercentage: "65%",
  },
  {
    id: "modern-benches",
    saleText: "SALE UP TO 40% OFF",
    title: "Modern Benches",
    buttonText: "View Collection",
    image: "/hero/slide-6-bench.png",
    discountPercentage: "40%",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
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
      className="relative h-screen w-full overflow-hidden bg-gray-50"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Main Content Container */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 lg:space-y-8 order-2 lg:order-1">
              {/* Sale Text */}
              <div className="overflow-hidden">
                <p
                  key={`sale-${currentSlide}`}
                  className="text-gray-600 text-sm md:text-base font-medium tracking-wider uppercase animate-[slideInFromLeft_0.8s_ease-out_0.2s_both]"
                >
                  {currentSlideData.saleText}
                </p>
              </div>

              {/* Main Title */}
              <div className="overflow-hidden">
                <h1
                  key={`title-${currentSlide}`}
                  className="text-gray-900 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight animate-[slideInFromLeft_1s_ease-out_0.4s_both]"
                >
                  {currentSlideData.title}
                </h1>
              </div>

              {/* CTA Button */}
              <div className="overflow-hidden">
                <Button
                  key={`button-${currentSlide}`}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 text-base rounded-none transition-all duration-300 animate-[slideInFromLeft_1s_ease-out_0.6s_both] w-fit"
                >
                  {currentSlideData.buttonText}
                </Button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative flex items-center justify-center order-1 lg:order-2">
              {/* Circular Shadow */}
              <div className="absolute inset-0 flex items-end justify-center pb-8 lg:pb-16">
                <div className="w-[400px] h-[200px] md:w-[500px] md:h-[250px] lg:w-[600px] lg:h-[300px] xl:w-[700px] xl:h-[350px] opacity-20">
                  <Image src="/hero/shadow.png" alt="Shadow" fill className="object-contain" />
                </div>
              </div>

              {/* Product Image - Larger Size */}
              <div className="relative z-10 w-full max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] aspect-square">
                <Image
                  key={`product-${currentSlide}`}
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  fill
                  className="object-contain animate-[fadeInScale_1.2s_ease-out_0.3s_both] drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Single Percentage Circle - Right Side */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
                <div
                  key={`percentage-${currentSlide}`}
                  className="w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-100 animate-[floatBounce_3s_ease-in-out_infinite]"
                >
                  <span className="text-gray-900 font-bold text-xl lg:text-2xl">
                    {currentSlideData.discountPercentage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Right Side Vertical with Connecting Line */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center gap-4">
        {/* Connecting Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-300 opacity-30"></div>

        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 z-10 ${
              index === currentSlide
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floatBounce {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-10px) scale(1.05);
          }
          50% {
            transform: translateY(-5px) scale(1.02);
          }
          75% {
            transform: translateY(-15px) scale(1.08);
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .animate-[floatBounce_3s_ease-in-out_infinite] {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}
