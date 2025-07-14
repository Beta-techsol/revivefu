"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectHeroProps {
  title: string
  subtitle: string
  heroImages: string[]
}

export default function ProjectHero({ title, subtitle, heroImages }: ProjectHeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || heroImages.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, heroImages.length])

  const scrollToGallery = () => {
    const gallerySection = document.getElementById("gallery")
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section className="relative h-[450px] overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-8">
          {/* Left Column - Text Content */}
          <div
            className={`space-y-6 transform transition-all duration-700 ease-out ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 font-urbanist leading-tight">{title}</h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">{subtitle}</p>
            </div>

            <Button
              onClick={scrollToGallery}
              className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Explore Gallery
              <ArrowDown className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
            </Button>
          </div>

          {/* Right Column - Hero Slider */}
          <div
            className={`relative h-full transform transition-all duration-700 ease-out delay-200 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
          >
            <div
              className="relative h-full rounded-2xl overflow-hidden shadow-2xl group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Slider Images */}
              <div className="relative w-full h-full">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Navigation Arrows */}
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Slide Indicators */}
              {heroImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Slide Counter */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {currentSlide + 1} / {heroImages.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
