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
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerHeight = containerRect.height
      const windowHeight = window.innerHeight

      // Calculate overall scroll progress through the container
      const startTrigger = windowHeight * 0.8
      const endTrigger = -containerHeight + windowHeight * 0.2
      
      const progress = Math.max(0, Math.min(1, 
        (startTrigger - containerTop) / (startTrigger - endTrigger)
      ))

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative py-20"
      style={{ height: `${200 + (showcaseItems.length - 1) * 100}vh` }}
    >
      {showcaseItems.map((item, index) => {
        // Calculate individual card progress
        const cardStart = index / showcaseItems.length
        const cardEnd = (index + 1) / showcaseItems.length
        const cardProgress = Math.max(0, Math.min(1, 
          (scrollProgress - cardStart) / (cardEnd - cardStart)
        ))

        // Calculate transforms for stacking effect
        const isActive = scrollProgress >= cardStart
        const translateY = isActive ? 0 : 100
        const scale = 0.95 + (cardProgress * 0.05)
        const opacity = isActive ? Math.max(0.3, cardProgress) : 0
        const zIndex = showcaseItems.length - index

        // Calculate stacking offset for cards that are stacked
        const stackOffset = Math.max(0, (scrollProgress - cardEnd) * 50)

        return (
          <div
            key={item.id}
            className="sticky top-20 w-full px-4 mb-8"
            style={{
              zIndex: zIndex,
              transform: `translateY(-${stackOffset}px)`,
            }}
          >
            <div
              className="w-full max-w-7xl mx-auto transition-all duration-700 ease-out"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: opacity,
              }}
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="grid lg:grid-cols-2 gap-0 min-h-[600px]">
                  {/* Content Section */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
                    <div className="space-y-8">
                      <div className="inline-block">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-0.5 bg-black"></div>
                          <span className="text-sm font-medium text-gray-600 tracking-[0.2em] uppercase">
                            Collection {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                      
                      <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                        {item.title}
                      </h2>
                      
                      <p className="text-gray-600 text-lg lg:text-xl leading-relaxed max-w-xl font-light">
                        {item.description}
                      </p>
                      
                      <div className="pt-4">
                        <Button 
                          className="bg-black hover:bg-gray-800 text-white px-12 py-6 rounded-full font-medium tracking-wide transition-all duration-300 group text-sm uppercase shadow-lg hover:shadow-xl"
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
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-transparent z-10"></div>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Decorative elements */}
                    <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/30 rounded-full"></div>
                    <div className="absolute bottom-8 left-8 w-24 h-0.5 bg-white/40"></div>
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
