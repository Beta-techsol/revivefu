"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroSlide {
  id: string
  saleText: string
  title: string
  buttonText: string
  image: string
  discountPercentage: {
    value: string
    position: {
      top?: string
      bottom?: string
      left?: string
      right?: string
    }
  }
}

const heroSlides: HeroSlide[] = [
  {
    id: "office-chairs",
    saleText: "SALE UP TO 60% OFF",
    title: "Office Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-1-chair.png",
    discountPercentage: {
      value: "60%",
      position: { top: "15%", right: "15%" },
    },
  },
  {
    id: "dining-tables",
    saleText: "SALE UP TO 55% OFF",
    title: "Dining Tables",
    buttonText: "View Collection",
    image: "/hero/slide-2-table.png",
    discountPercentage: {
      value: "55%",
      position: { top: "20%", right: "10%" },
    },
  },
  {
    id: "armchairs",
    saleText: "SALE UP TO 70% OFF",
    title: "Luxury Armchairs",
    buttonText: "View Collection",
    image: "/hero/slide-3-armchair.png",
    discountPercentage: {
      value: "70%",
      position: { top: "10%", right: "20%" },
    },
  },
  {
    id: "wicker-furniture",
    saleText: "SALE UP TO 50% OFF",
    title: "Wicker Furniture",
    buttonText: "View Collection",
    image: "/hero/slide-4-wicker-chair.png",
    discountPercentage: {
      value: "50%",
      position: { top: "25%", right: "12%" },
    },
  },
  {
    id: "rocking-chairs",
    saleText: "SALE UP TO 65% OFF",
    title: "Rocking Chairs",
    buttonText: "View Collection",
    image: "/hero/slide-5-rocking-chair.png",
    discountPercentage: {
      value: "65%",
      position: { top: "18%", right: "18%" },
    },
  },
  {
    id: "modern-benches",
    saleText: "SALE UP TO 40% OFF",
    title: "Modern Benches",
    buttonText: "View Collection",
    image: "/hero/slide-6-bench.png",
    discountPercentage: {
      value: "40%",
      position: { top: "22%", right: "16%" },
    },
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
                  variant="ghost"
                  className="text-gray-900 hover:text-gray-700 font-medium px-0 py-3 text-base h-auto bg-transparent hover:bg-transparent transition-all duration-300 animate-[slideInFromLeft_1s_ease-out_0.6s_both] w-fit group"
                >
                  {currentSlideData.buttonText}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="relative flex items-center justify-center order-1 lg:order-2 h-full">
              {/* Circular Shadow - Positioned at bottom */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-0">
                <div
                  key={`shadow-${currentSlide}`}
                  className="w-[280px] h-[140px] md:w-[350px] md:h-[175px] lg:w-[420px] lg:h-[210px] xl:w-[500px] xl:h-[250px] opacity-15 animate-[slideUpFromBottom_1s_ease-out_0.5s_both]"
                >
                  <Image src="/hero/shadow.png" alt="Shadow" fill className="object-contain" />
                </div>
              </div>

              {/* Product Image Container */}
              <div className="relative z-10 w-full h-full max-w-[400px] lg:max-w-[500px] xl:max-w-[600px] flex items-center justify-center">
                <div className="relative w-full aspect-square max-h-[500px] lg:max-h-[600px]">
                  <Image
                    key={`product-${currentSlide}`}
                    src={currentSlideData.image || "/placeholder.svg"}
                    alt={currentSlideData.title}
                    fill
                    className="object-contain animate-[fadeInScale_1.2s_ease-out_0.3s_both] drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>

              {/* Single Animated Percentage Circle */}
              <div
                key={`discount-${currentSlide}`}
                className="absolute z-20 hidden md:block"
                style={{
                  top: currentSlideData.discountPercentage.position.top,
                  bottom: currentSlideData.discountPercentage.position.bottom,
                  left: currentSlideData.discountPercentage.position.left,
                  right: currentSlideData.discountPercentage.position.right,
                }}
              >
                <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100 animate-[floatBounce_3s_ease-in-out_infinite]">
                  <span className="text-gray-900 font-bold text-xl lg:text-2xl font-dancing-script">
                    {currentSlideData.discountPercentage.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators - Right Center with connecting line */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20">
        {/* Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 opacity-30 transform -translate-x-1/2"></div>

        {/* Indicators */}
        <div className="relative flex flex-col gap-6">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative ${
                index === currentSlide
                  ? "bg-gray-900 text-white scale-110"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
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

        @keyframes slideUpFromBottom {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(30px);
          }
          to {
            opacity: 0.15;
            transform: translateX(-50%) translateY(0);
          }
        }

        @keyframes floatBounce {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          25% {
            transform: translateY(-8px) scale(1.02);
          }
          50% {
            transform: translateY(-4px) scale(1.01);
          }
          75% {
            transform: translateY(-12px) scale(1.03);
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
