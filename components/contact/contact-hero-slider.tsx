"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const slides = [
  {
    id: 1,
    leftImage: "/shop/hero-sofa-main.jpg",
    rightImage: "/shop/hero-detail-1.jpg",
    title: "Get in touch with us",
    subtitle: "Send us a message",
    description:
      "Transform your space with our premium furniture collection. Quality craftsmanship meets modern design.",
  },
  {
    id: 2,
    leftImage: "/shop/hero-detail-2.jpg",
    rightImage: "/shop/products/sofa-1.jpg",
    title: "Premium Quality",
    subtitle: "Exceptional Service",
    description: "Experience the finest furniture with our dedicated customer service and expert craftsmanship.",
  },
  {
    id: 3,
    leftImage: "/shop/products/chair-1.jpg",
    rightImage: "/shop/products/dining-table-1.jpg",
    title: "Custom Solutions",
    subtitle: "Your Dream Space",
    description:
      "Let us help you create the perfect living space with our custom furniture solutions and design expertise.",
  },
]

export function ContactHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Slider Container */}
      <div className="relative h-full flex">
        {/* Left Image - 35% */}
        <div className="relative w-[35%] h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`left-${slide.id}`}
              className={`absolute inset-0 transition-all duration-1200 ease-out ${
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-100px]"
              }`}
            >
              <Image
                src={slide.leftImage || "/placeholder.svg"}
                alt={`Furniture ${slide.id}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Black Content Section - 30% */}
        <div className="relative w-[30%] h-full bg-black flex flex-col justify-center items-center text-white px-8">
          {slides.map((slide, index) => (
            <div
              key={`content-${slide.id}`}
              className={`absolute inset-0 flex flex-col justify-center items-center px-8 transition-all duration-1000 ease-out ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`text-center transition-all duration-1000 ease-out delay-100 ${
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-30px]"
                }`}
              >
                <h1 className="text-3xl font-bold mb-2">{slide.title}</h1>
                <h2 className="text-xl mb-4 text-gray-300">{slide.subtitle}</h2>
              </div>
              <div
                className={`text-center transition-all duration-1000 ease-out delay-200 ${
                  index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
                }`}
              >
                <p className="text-gray-400 leading-relaxed">{slide.description}</p>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Image - 35% */}
        <div className="relative w-[35%] h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={`right-${slide.id}`}
              className={`absolute inset-0 transition-all duration-1200 ease-out ${
                index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
              }`}
            >
              <Image
                src={slide.rightImage || "/placeholder.svg"}
                alt={`Furniture ${slide.id}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Shop Now Button */}
      <div className="absolute right-0 top-0 h-full w-[90px] bg-gradient-to-b from-[#C53D39] to-[#F1BA69] flex items-center justify-center">
        <button className="h-full w-full flex items-center justify-center group">
          <span className="text-white text-4xl font-['Dancing_Script'] font-bold transform -rotate-90 whitespace-nowrap glossy-text">
            Shop Now
          </span>
        </button>
      </div>

      <style jsx>{`
        .glossy-text {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 1) 25%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.8) 75%,
            rgba(255, 255, 255, 0.6) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s ease-in-out infinite;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
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
