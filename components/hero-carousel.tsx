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
  discount: string
  description: string
  image: string
  theme: {
    primary: string
    secondary: string
    accent: string
    gradient: string
  }
}

const heroSlides: HeroSlide[] = [
  {
    id: "bedroom",
    category: "Bedroom Collection",
    title: "Inoterior",
    subtitle: "Transform Your Space",
    discount: "70",
    description:
      "Discover premium bedroom furniture that combines comfort with elegant design for your perfect sanctuary.",
    image: "/hero/bedroom-furniture.webp",
    theme: {
      primary: "#8B7355",
      secondary: "#D4C4A8",
      accent: "#F5F1E8",
      gradient: "from-amber-900/30 via-amber-800/20 to-amber-700/30",
    },
  },
  {
    id: "living-room",
    category: "Living Room Collection",
    title: "Inoterior",
    subtitle: "Modern Living Spaces",
    discount: "65",
    description:
      "Create stunning living spaces with our contemporary furniture collection designed for modern lifestyles.",
    image: "/hero/living-room-furniture.png",
    theme: {
      primary: "#4A5568",
      secondary: "#718096",
      accent: "#E2E8F0",
      gradient: "from-slate-900/30 via-slate-800/20 to-slate-700/30",
    },
  },
  {
    id: "luxury-sofa",
    category: "Luxury Collection",
    title: "Inoterior",
    subtitle: "Premium Comfort",
    discount: "55",
    description: "Experience unmatched luxury with our premium sofa collection crafted for ultimate comfort and style.",
    image: "/hero/luxury-sofa-set.jpeg",
    theme: {
      primary: "#2D5A27",
      secondary: "#48BB78",
      accent: "#F0FFF4",
      gradient: "from-emerald-900/30 via-emerald-800/20 to-emerald-700/30",
    },
  },
  {
    id: "office",
    category: "Office Collection",
    title: "Inoterior",
    subtitle: "Professional Workspace",
    discount: "60",
    description: "Enhance productivity with our professional office furniture designed for modern work environments.",
    image: "/hero/modern-office-furniture.png",
    theme: {
      primary: "#2B6CB0",
      secondary: "#4299E1",
      accent: "#EBF8FF",
      gradient: "from-blue-900/30 via-blue-800/20 to-blue-700/30",
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

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 6000)
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
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image || "/placeholder.svg"}
          alt={currentSlideData.category}
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
          priority
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.theme.gradient} transition-all duration-1000`}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            {/* Category - Subtitle */}
            <div className="mb-4 overflow-hidden">
              <p
                key={`category-${currentSlide}`}
                className="text-white/90 text-lg md:text-xl font-medium animate-[slideInFromTop_0.8s_ease-out_0.2s_both] tracking-wider uppercase"
              >
                {currentSlideData.category}
              </p>
            </div>

            {/* Main Title */}
            <div className="mb-6 overflow-hidden">
              <h1
                key={`title-${currentSlide}`}
                className="text-white text-6xl md:text-7xl lg:text-8xl font-bold animate-[slideInFromLeft_1s_ease-out_0.4s_both] tracking-tight"
              >
                {currentSlideData.title}
              </h1>
            </div>

            {/* Subtitle with Dancing Script and Gradient Glow */}
            <div className="mb-6 overflow-hidden">
              <p
                key={`subtitle-${currentSlide}`}
                className="font-['Dancing_Script'] text-3xl md:text-4xl lg:text-5xl font-normal animate-[slideInFromRight_1s_ease-out_0.6s_both]"
                style={{
                  background: "linear-gradient(45deg, #C53D39, #F1BA69, #C53D39)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradientGlow 3s ease-in-out infinite, slideInFromRight 1s ease-out 0.6s both",
                  textShadow: "0 0 20px rgba(197, 61, 57, 0.5), 0 0 40px rgba(241, 186, 105, 0.3)",
                  filter: "drop-shadow(0 0 10px rgba(197, 61, 57, 0.4))",
                }}
              >
                {currentSlideData.subtitle}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8 overflow-hidden">
              <p
                key={`description-${currentSlide}`}
                className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_1s_ease-out_0.8s_both]"
              >
                {currentSlideData.description}
              </p>
            </div>

            {/* Discount Section - Centered */}
            <div className="mb-10 overflow-hidden">
              <div
                key={`discount-${currentSlide}`}
                className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-4 animate-[scaleIn_1s_ease-out_1s_both]"
              >
                <span className="text-white text-lg md:text-xl font-medium">UP TO</span>
                <span className="text-white text-4xl md:text-5xl lg:text-6xl font-bold">
                  {currentSlideData.discount}%
                </span>
                <span className="text-white text-lg md:text-xl font-medium">OFF</span>
              </div>
            </div>

            {/* Action Buttons - Centered */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center overflow-hidden">
              <Button
                key={`shop-now-${currentSlide}`}
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#A12E2A] hover:to-[#E1A659] text-white font-semibold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-[slideInFromBottom_1s_ease-out_1.4s_both]"
              >
                SHOP NOW
              </Button>
              <Button
                key={`explore-${currentSlide}`}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-10 py-4 text-lg rounded-xl transition-all duration-300 animate-[slideInFromBottom_1s_ease-out_1.6s_both] bg-transparent backdrop-blur-sm"
              >
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Bottom Right */}
      <div className="absolute bottom-[5%] right-[5%] z-20 flex gap-3">
        <button
          onClick={prevSlide}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={nextSlide}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-10 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gradientGlow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  )
}
