"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    leftImage: "/about/hero-1.jpg",
    rightImage1: "/about/hero-2.jpg",
    rightImage2: "/about/hero-3.jpg",
    title: "Reviving Furniture for Every Space",
    subtitle: "Crafted in Lahore. Loved across Pakistan.",
    description:
      "Transforming homes with premium furniture that combines traditional craftsmanship with modern design.",
  },
  {
    id: 2,
    leftImage: "/about/hero-2.jpg",
    rightImage1: "/about/hero-3.jpg",
    rightImage2: "/about/hero-1.jpg",
    title: "Quality That Speaks Volumes",
    subtitle: "Excellence in Every Detail.",
    description:
      "From concept to creation, we ensure every piece meets the highest standards of quality and durability.",
  },
  {
    id: 3,
    leftImage: "/about/hero-3.jpg",
    rightImage1: "/about/hero-1.jpg",
    rightImage2: "/about/hero-2.jpg",
    title: "Your Dream Space Awaits",
    subtitle: "Furniture That Tells Your Story.",
    description: "Creating beautiful, functional spaces that reflect your personality and enhance your lifestyle.",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 2000)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 2000)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000)
    return () => clearInterval(interval)
  }, [isAnimating])

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-gray-100">
      {/* Shop Now Vertical Bar */}
      <div className="absolute left-0 top-0 w-[90px] h-full bg-gradient-to-b from-[#C53D39] to-[#F1BA69] flex items-center justify-center z-10">
        <Link href="/shop" className="block">
          <div className="transform -rotate-90 whitespace-nowrap">
            <span className="text-white font-['Dancing_Script'] text-6xl font-bold tracking-wider glossy-text">
              Shop Now
            </span>
          </div>
        </Link>
      </div>

      {/* Main Slider Content */}
      <div className="ml-[90px] h-full flex">
        {/* Left Image - 30% */}
        <div className="w-[30%] h-full relative overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
              isAnimating
                ? "transform translate-y-full opacity-0 scale-105"
                : "transform translate-y-0 opacity-100 scale-100"
            }`}
          >
            <img
              src={currentSlideData.leftImage || "/placeholder.svg"}
              alt="Furniture showcase"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Black Content Block - 30% */}
        <div className="w-[30%] h-full bg-black flex flex-col justify-center items-center text-white p-8 relative">
          <div
            className={`text-center transition-all duration-[1500ms] ease-in-out ${isAnimating ? "opacity-0" : "opacity-100"}`}
          >
            <div
              className={`transition-all duration-[1200ms] ease-in-out delay-200 ${
                isAnimating ? "transform -translate-x-16 opacity-0" : "transform translate-x-0 opacity-100"
              }`}
            >
              <h1 className="text-2xl font-bold font-['Montserrat'] mb-2 leading-tight">{currentSlideData.title}</h1>
            </div>

            <div
              className={`transition-all duration-[1200ms] ease-in-out delay-400 ${
                isAnimating ? "transform translate-x-16 opacity-0" : "transform translate-x-0 opacity-100"
              }`}
            >
              <h2 className="text-lg font-['Dancing_Script'] text-[#F1BA69] mb-4">{currentSlideData.subtitle}</h2>
            </div>

            <div
              className={`transition-all duration-[1200ms] ease-in-out delay-600 ${
                isAnimating ? "transform translate-y-8 opacity-0" : "transform translate-y-0 opacity-100"
              }`}
            >
              <p className="text-sm text-gray-300 leading-relaxed">{currentSlideData.description}</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Right Images - 40% total (20% each) */}
        <div className="w-[40%] h-full flex">
          {/* Right Image 1 */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out delay-200 ${
                isAnimating
                  ? "transform translate-y-full opacity-0 scale-105"
                  : "transform translate-y-0 opacity-100 scale-100"
              }`}
            >
              <img
                src={currentSlideData.rightImage1 || "/placeholder.svg"}
                alt="Furniture showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Image 2 */}
          <div className="w-1/2 h-full relative overflow-hidden">
            <div
              className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out delay-400 ${
                isAnimating
                  ? "transform translate-x-full opacity-0 scale-105"
                  : "transform translate-x-0 opacity-100 scale-100"
              }`}
            >
              <img
                src={currentSlideData.rightImage2 || "/placeholder.svg"}
                alt="Furniture showcase"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for glossy effect */}
      <style jsx>{`
        .glossy-text {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 1) 25%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.8) 75%,
            rgba(255, 255, 255, 0.3) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          50% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}
