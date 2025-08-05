"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const portfolioSlides = [
  {
    id: 1,
    leftImage: "/portfolio/cowo-coworking.jpg",
    centerImage: "/portfolio/meezan-bank.jpg",
    rightImage: "/portfolio/forrun-office.jpg",
    title: "Contemporary Office Lounge – 2023",
    subtitle: "Handcrafted walnut pieces, custom layout",
    description: "Modern coworking spaces with premium furniture solutions",
  },
  {
    id: 2,
    leftImage: "/portfolio/fig-solutions.jpg",
    centerImage: "/portfolio/cwsa-murree.jpg",
    rightImage: "/portfolio/meezan-bank.jpg",
    title: "Executive Meeting Spaces – 2022",
    subtitle: "Ergonomic design meets luxury comfort",
    description: "Professional conference rooms with custom furniture",
  },
  {
    id: 3,
    leftImage: "/portfolio/forrun-office.jpg",
    centerImage: "/portfolio/cowo-coworking.jpg",
    rightImage: "/portfolio/fig-solutions.jpg",
    title: "Corporate Workspace Solutions – 2021",
    subtitle: "Innovative designs for modern businesses",
    description: "Complete office furniture solutions for growing companies",
  },
]

export default function PortfolioHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide()
      }
    }, 6000)

    return () => clearInterval(timer)
  }, [currentSlide, isAnimating])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % portfolioSlides.length)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + portfolioSlides.length) % portfolioSlides.length)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  const currentSlideData = portfolioSlides[currentSlide]

  return (
    <>
      {/* Google Fonts Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="relative w-full">
        {/* Main Slider - 400px height */}
        <div className="relative h-[400px] w-full overflow-hidden bg-gray-100">
          <div className="flex h-full w-full">
            {/* Left Image - 30% */}
            <div className="relative w-[30%] h-full overflow-hidden">
              <div
                className={`absolute inset-0 transition-all duration-1500 ease-out ${
                  isAnimating ? "transform translate-y-[-100px] opacity-0" : "transform translate-y-0 opacity-100"
                }`}
              >
                <Image
                  src={currentSlideData.leftImage || "/placeholder.svg"}
                  alt="Portfolio Left"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Center Image - 20% */}
            <div className="relative w-[20%] h-full overflow-hidden">
              <div
                className={`absolute inset-0 transition-all duration-1500 ease-out ${
                  isAnimating ? "transform translate-x-[-100px] opacity-0" : "transform translate-x-0 opacity-100"
                }`}
              >
                <Image
                  src={currentSlideData.centerImage || "/placeholder.svg"}
                  alt="Portfolio Center"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Black Content Block - 30% */}
            <div className="relative w-[30%] h-full bg-black flex flex-col justify-center items-center text-white px-8">
              <div
                className={`text-center transition-all duration-1000 ease-out ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
              >
                <div
                  className={`transition-all duration-1000 ease-out delay-200 ${
                    isAnimating ? "transform translate-x-[-50px] opacity-0" : "transform translate-x-0 opacity-100"
                  }`}
                >
                  <h2 className="text-2xl font-bold mb-2 font-urbanist">{currentSlideData.title}</h2>
                </div>

                <div
                  className={`transition-all duration-1000 ease-out delay-300 ${
                    isAnimating ? "transform translate-x-[50px] opacity-0" : "transform translate-x-0 opacity-100"
                  }`}
                >
                  <p
                    className="text-lg text-amber-400 mb-4 font-medium dancing-script-subtitle"
                    style={{ fontFamily: "'Dancing Script', cursive" }}
                  >
                    {currentSlideData.subtitle}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{currentSlideData.description}</p>
                </div>
              </div>

              {/* Navigation Arrows - Bottom Right */}
              <div className="absolute bottom-6 right-6 flex gap-2">
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

            {/* Right Image - 20% */}
            <div className="relative w-[20%] h-full overflow-hidden">
              <div
                className={`absolute inset-0 transition-all duration-1500 ease-out ${
                  isAnimating ? "transform translate-x-[100px] opacity-0" : "transform translate-x-0 opacity-100"
                }`}
              >
                <Image
                  src={currentSlideData.rightImage || "/placeholder.svg"}
                  alt="Portfolio Right"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shop Now Bar - 90px height with gradient background */}
        <div className="relative h-[90px] w-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-400 flex items-center justify-center overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
          </div>

          {/* Shop Now Text with Dancing Script */}
          <div className="relative z-10">
            <h2
              className="text-6xl font-bold text-white text-center tracking-wider glossy-text-portfolio dancing-script-shop"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Shop Now
            </h2>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shine-portfolio"></div>
        </div>

        <style jsx>{`
          .dancing-script-subtitle {
            font-family: 'Dancing Script', cursive;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .dancing-script-shop {
            font-family: 'Dancing Script', cursive;
            font-weight: 700;
            letter-spacing: 1px;
          }

          .glossy-text-portfolio {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 30px rgba(255, 255, 255, 0.2);
            background: linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: glossy-glow-portfolio 3s ease-in-out infinite;
          }

          @keyframes glossy-glow-portfolio {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }

          @keyframes shine-portfolio {
            0% {
              transform: translateX(-100%) skewX(-12deg);
            }
            100% {
              transform: translateX(200%) skewX(-12deg);
            }
          }

          .animate-shine-portfolio {
            animation: shine-portfolio 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  )
}
