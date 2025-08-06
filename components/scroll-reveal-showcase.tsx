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

      // Only start the effect when the section is properly in view
      // Wait until the section is at least 20% visible from the top
      const sectionStartThreshold = windowHeight * 0.8
      const sectionEndThreshold = -containerHeight + windowHeight * 0.2

      // Don't start the effect until the section is properly visible
      if (containerTop > sectionStartThreshold) {
        setActiveIndex(0)
        return
      }

      // Don't continue the effect after the section has mostly passed
      if (containerTop < sectionEndThreshold) {
        setActiveIndex(showcaseItems.length - 1)
        return
      }

      // Calculate progress only within the active scroll range
      const activeScrollRange = sectionStartThreshold - sectionEndThreshold
      const currentScrollPosition = sectionStartThreshold - containerTop
      const scrollProgress = Math.max(0, Math.min(1, currentScrollPosition / activeScrollRange))

      // Create more deliberate thresholds for each card
      // Each card should be visible for a longer duration
      const cardThresholds = showcaseItems.map((_, index) => {
        const baseThreshold = index / (showcaseItems.length - 1)
        // Add some overlap and make transitions smoother
        return baseThreshold * 0.8 + 0.1
      })

      // Find the appropriate card index based on scroll progress
      let newActiveIndex = 0
      for (let i = cardThresholds.length - 1; i >= 0; i--) {
        if (scrollProgress >= cardThresholds[i]) {
          newActiveIndex = i
          break
        }
      }

      // Only update if the index actually changes to prevent unnecessary re-renders
      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }

    // Use throttling to improve performance
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [activeIndex])

  return (
    <div 
      ref={containerRef}
      className="relative"
      style={{ height: `${200}vh` }}
    >
      <div className="sticky top-0 w-full h-screen flex items-center justify-center px-4">
        {showcaseItems.map((item, index) => {
          const isVisible = index <= activeIndex
          const isActive = index === activeIndex
          
          // Reverse the stacking order so newer items appear on top
          const stackOrder = activeIndex - index
          
          // Calculate transforms for proper stacking effect
          const translateY = isVisible ? stackOrder * 20 : 100
          const scale = isVisible ? 1 - (Math.max(0, stackOrder) * 0.05) : 0.9
          const opacity = isVisible ? 1 - (Math.max(0, stackOrder) * 0.3) : 0
          const zIndex = showcaseItems.length - stackOrder

          return (
            <div
              key={item.id}
              className="absolute inset-4 transition-all duration-700 ease-in-out"
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
            >
              <div className="w-full max-w-6xl mx-auto h-[450px]">
                <div className="bg-white rounded-lg overflow-hidden h-full border border-gray-200">
                  <div className="grid lg:grid-cols-2 gap-0 h-full">
                    {/* Content Section */}
                    <div className="flex flex-col justify-center p-6 lg:p-8 xl:p-10 bg-white">
                      <div className="space-y-4">
                        <div className="inline-block">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-0.5 bg-black"></div>
                            <span className="text-xs font-medium text-gray-500 tracking-wider uppercase">
                              Collection {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                        
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight">
                          {item.title}
                        </h2>
                        
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed max-w-md">
                          {item.description}
                        </p>
                        
                        <div className="pt-4">
                          <Button 
                            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-none font-medium tracking-wide transition-all duration-300 group text-xs uppercase"
                            asChild
                          >
                            <a href={item.href}>
                              {item.buttonText}
                              <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
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
                        className="w-full h-[450px] object-cover transition-transform duration-700 hover:scale-105"
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
