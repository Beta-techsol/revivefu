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
  discountPercentages: Array<{
    value: string
    position: {
      top?: string
      bottom?: string
      left?: string
      right?: string
    }
    delay: number
  }>
}

const heroSlides: HeroSlide[] = [
  {
    id: "office-chairs",
    saleText: "SALE UP TO 60% OFF",
    title: "Office Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-1-chair.png",
    discountPercentages: [
      { value: "60%", position: { top: "15%", right: "15%" }, delay: 0 },
      { value: "45%", position: { top: "45%", left: "8%" }, delay: 0.5 },
      { value: "30%", position: { bottom: "25%", right: "25%" }, delay: 1 },
    ],
  },
  {
    id: "dining-tables",
    saleText: "SALE UP TO 55% OFF",
    title: "Dining Tables",
    buttonText: "View Collection",
    image: "/hero/slide-2-table.png",
    discountPercentages: [
      { value: "55%", position: { top: "20%", right: "10%" }, delay: 0 },
      { value: "40%", position: { top: "50%", left: "5%" }, delay: 0.7 },
      { value: "25%", position: { bottom: "20%", right: "30%" }, delay: 1.2 },
    ],
  },
  {
    id: "armchairs",
    saleText: "SALE UP TO 70% OFF",
    title: "Luxury Armchairs",
    buttonText: "View Collection",
    image: "/hero/slide-3-armchair.png",
    discountPercentages: [
      { value: "70%", position: { top: "10%", right: "20%" }, delay: 0 },
      { value: "50%", position: { top: "40%", left: "10%" }, delay: 0.6 },
      { value: "35%", position: { bottom: "30%", right: "15%" }, delay: 1.1 },
    ],
  },
  {
    id: "wicker-furniture",
    saleText: "SALE UP TO 50% OFF",
    title: "Wicker Furniture",
    buttonText: "View Collection",
    image: "/hero/slide-4-wicker-chair.png",
    discountPercentages: [
      { value: "50%", position: { top: "25%", right: "12%" }, delay: 0 },
      { value: "35%", position: { top: "55%", left: "12%" }, delay: 0.8 },
      { value: "20%", position: { bottom: "15%", right: "35%" }, delay: 1.3 },
    ],
  },
  {
    id: "rocking-chairs",
    saleText: "SALE UP TO 65% OFF",
    title: "Rocking Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-5-rocking-chair.png",
    discountPercentages: [
      { value: "65%", position: { top: "18%", right: "18%" }, delay: 0 },
      { value: "45%", position: { top: "48%", left: "6%" }, delay: 0.4 },
      { value: "30%", position: { bottom: "22%", right: "28%" }, delay: 0.9 },
    ],
  },
  {
    id: "modern-benches",
    saleText: "SALE UP TO 40% OFF",
    title: "Modern Benches",
    buttonText: "View Collection",
    image: "/hero/slide-6-bench.png",
    discountPercentages: [
      { value: "40%", position: { top: "22%", right: "16%" }, delay: 0 },
      { value: "25%", position: { top: "52%", left: "8%" }, delay: 0.6 },
      { value: "15%", position: { bottom: "28%", right: "32%" }, delay: 1.1 },
    ],
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
                <div className="w-[300px] h-[150px] md:w-[400px] md:h-[200px] lg:w-[500px] lg:h-[250px] xl:w-[600px] xl:h-[300px] opacity-20">
                  <Image src="/hero/shadow.png" alt="Shadow" fill className="object-contain" />
                </div>
              </div>

              {/* Product Image */}
              <div className="relative z-10 w-full max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] aspect-square">
                <Image
                  key={`product-${currentSlide}`}
                  src={currentSlideData.image || "/placeholder.svg"}
                  alt={currentSlideData.title}
                  fill
                  className="object-contain animate-[fadeInScale_1.2s_ease-out_0.3s_both] drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Animated Percentage Circles */}
              {currentSlideData.discountPercentages.map((discount, index) => (
                <div
                  key={`${currentSlide}-${index}`}
                  className="absolute z-20 hidden md:block"
                  style={{
                    top: discount.position.top,
                    bottom: discount.position.bottom,
                    left: discount.position.left,
                    right: discount.position.right,
                  }}
                >
                  <div
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100 animate-[floatBounce_3s_ease-in-out_infinite]"
                    style={{
                      animationDelay: `${discount.delay}s`,
                    }}
                  >
                    <span className="text-gray-900 font-bold text-sm lg:text-base">{discount.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Bottom Right */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
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
