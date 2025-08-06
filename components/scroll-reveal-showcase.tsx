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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerHeight = containerRect.height
      const windowHeight = window.innerHeight

      // Calculate which card should be active based on scroll position
      const scrollProgress = Math.max(0, Math.min(1, 
        (windowHeight * 0.5 - containerTop) / (containerHeight - windowHeight)
      ))

      const newActiveIndex = Math.min(
        showcaseItems.length - 1,
        Math.floor(scrollProgress * showcaseItems.length)
      )

      setActiveIndex(newActiveIndex)
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
      className="relative"
      style={{ height: `${300}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center px-4">
        {showcaseItems.map((item, index) => {
          const isVisible = index <= activeIndex
          const isActive = index === activeIndex
          const stackOrder = index
          
          // Calculate transforms for stacking effect
          const translateY = isVisible ? stackOrder * -8 : 100
          const scale = isVisible ? 1 - (stackOrder * 0.02) : 0.9
          const opacity = isVisible ? 1 : 0
          const zIndex = showcaseItems.length - index

          return (
            <div
              key={item.id}
              className="absolute inset-4 transition-all duration-700 ease-out"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
            >
              <div className="w-full max-w-7xl mx-auto h-full">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full border border-gray-100">
                  <div className="grid lg:grid-cols-2 gap-0 h-full">
                    {/* Content Section */}
                    <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-gray-50 to-white">
                      <div className="space-y-6">
                        <div className="inline-block">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-0.5 bg-black"></div>
                            <span className="text-sm font-medium text-gray-600 tracking-[0.2em] uppercase">
                              Collection {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
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
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
