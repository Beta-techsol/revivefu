"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

interface ShowcaseItem {
  id: string
  title: string
  description: string
  image: string
  buttonText: string
  href: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "elegant-chairs",
    title: "ELEGANT LIVING ROOM CHAIRS",
    description: "Transform your living space with our collection of sophisticated chairs. From modern accent pieces to classic armchairs, find the perfect seating solution that combines comfort with timeless style.",
    image: "/showcase/chair.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=chairs"
  },
  {
    id: "office-furniture",
    title: "OFFICE FURNITURE",
    description: "Upgrade your workspace with ergonomic and stylish office furniture. From sleek desks to comfortable chairs, find everything you need for a productive and modern office!",
    image: "/showcase/office-furniture.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=office"
  },
  {
    id: "luxury-sofas",
    title: "LUXURY SOFA COLLECTION",
    description: "Experience ultimate comfort with our premium sofa collection. Crafted with the finest materials and attention to detail, each piece is designed to be the centerpiece of your living room.",
    image: "/showcase/sofa.avif",
    buttonText: "SHOP NOW",
    href: "/shop?category=sofas"
  }
]

export function ScrollRevealShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState<number[]>([0, 0, 0])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerHeight = containerRect.height
      const windowHeight = window.innerHeight

      // Calculate scroll progress for each card
      const newProgress = showcaseItems.map((_, index) => {
        const cardStart = -containerHeight + windowHeight
        const cardEnd = -windowHeight * 0.3
        const totalDistance = cardStart - cardEnd
        
        const currentPosition = containerTop + (index * windowHeight * 0.7)
        const progress = Math.max(0, Math.min(1, (cardStart - currentPosition) / totalDistance))
        
        return progress
      })

      setScrollProgress(newProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: `${100 + (showcaseItems.length - 1) * 70}vh` }}
    >
      {showcaseItems.map((item, index) => {
        const progress = scrollProgress[index]
        const isVisible = progress > 0
        const scale = 0.95 + (progress * 0.05)
        const translateY = (1 - progress) * 100
        const opacity = Math.max(0.3, progress)

        return (
          <div
            key={item.id}
            className="sticky top-0 w-full h-screen flex items-center justify-center px-4"
            style={{
              zIndex: showcaseItems.length - index,
            }}
          >
            <div
              className="w-full max-w-7xl mx-auto transition-all duration-300 ease-out"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: isVisible ? opacity : 0,
              }}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[500px]">
                  {/* Content Section */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-gray-50 to-white">
                    <div className="space-y-6">
                      <div className="inline-block">
                        <span className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
                          Collection {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                        {item.title}
                      </h2>
                      <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-lg">
                        {item.description}
                      </p>
                      <div className="pt-6">
                        <Button 
                          className="bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-none font-medium tracking-wide transition-all duration-300 group text-sm uppercase"
                          asChild
                        >
                          <a href={item.href}>
                            {item.buttonText}
                            <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-2" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/5 z-10"></div>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                      loading="lazy"
                    />
                    {/* Decorative overlay */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-black/10 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
