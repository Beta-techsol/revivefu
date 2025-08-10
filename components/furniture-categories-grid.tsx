"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react"

interface Category {
  id: string
  name: string
  image: string
  href: string
  description: string
}

const categories: Category[] = [
  { id: "office-table", name: "Office Table", image: "/categories/office-table.jpeg", href: "/category/office-tables", description: "Professional workspace solutions" },
  { id: "study-table", name: "Study Table", image: "/categories/study-table.webp", href: "/category/study-tables", description: "Perfect for learning and productivity" },
  { id: "bed", name: "Bed", image: "/categories/bed.jpeg", href: "/category/beds", description: "Comfortable sleeping solutions" },
  { id: "tea-trolly", name: "Tea Trolly", image: "/categories/tea-trolly.jpeg", href: "/category/tea-trolleys", description: "Elegant serving solutions" },
  { id: "office-decor", name: "Office Decor", image: "/categories/office-decor.jpeg", href: "/category/office-decor", description: "Enhance your workspace aesthetics" },
  { id: "center-table", name: "Center Table", image: "/categories/center-table.jpeg", href: "/category/center-tables", description: "Stylish living room centerpieces" },
  { id: "workstation", name: "Workstation", image: "/categories/workstation.jpeg", href: "/category/workstations", description: "Complete office solutions" },
  { id: "office-chair", name: "Office Chair", image: "/categories/office-chair.webp", href: "/category/office-chairs", description: "Ergonomic seating comfort" },
  { id: "dining-table", name: "Dining Table", image: "/categories/dining-table.jpeg", href: "/category/dining-tables", description: "Family gathering spaces" },
]

export default function FurnitureCategoriesGrid() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  // Controls for pausing auto-scroll when user interacts
  const autoScrollPausedRef = useRef(false)
  const resumeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Auto-scroll using the carousel's current scrollLeft so manual scrolls are preserved
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let rafId = 0
    const scrollSpeed = 0.6 // px per frame (tweak if you want faster/slower)

    const animate = () => {
      if (!carousel) return

      if (!autoScrollPausedRef.current) {
        // move the native scrollLeft so manual interaction isn't overridden
        carousel.scrollLeft += scrollSpeed
        // seamless loop when we've passed the first set
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    if (isInView) rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      if (resumeTimeoutRef.current) {
        window.clearTimeout(resumeTimeoutRef.current)
        resumeTimeoutRef.current = null
      }
    }
  }, [isInView])

  const pauseAutoScroll = (ms = 3000) => {
    autoScrollPausedRef.current = true
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = window.setTimeout(() => {
      autoScrollPausedRef.current = false
      resumeTimeoutRef.current = null
    }, ms)
  }

  const scrollCarousel = (direction: "left" | "right") => {
    const carousel = carouselRef.current
    if (!carousel) return

    pauseAutoScroll(3000)

    // Scroll by visible width for better UX
    const scrollAmount = carousel.offsetWidth || 320
    carousel.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories]

  return (
    <section ref={sectionRef} className="py-[2%] bg-gray-50 relative overflow-hidden">
      {/* Header (centered) */}
      <div className="container mx-auto px-4 relative z-10 mb-12">
        <div
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 text-center">
            Shop by{' '}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
            Discover our comprehensive collection of premium furniture for every space
          </p>
        </div>
      </div>

      {/* Full-Width Horizontal Scrolling Carousel */}
      <div className="relative w-full">
        <div
          ref={carouselRef}
          className={`flex gap-6 overflow-x-auto pb-8 transition-all duration-1000 delay-300 ${isInView ? "opacity-100" : "opacity-0"}`}
          style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch", paddingLeft: "2rem", paddingRight: "2rem" }}
          onMouseEnter={() => {
            // pause auto-scroll when user hovers the carousel
            autoScrollPausedRef.current = true
          }}
          onMouseLeave={() => {
            // resume after a short delay so user doesn't get snapped
            pauseAutoScroll(1000)
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <Link
              key={`${category.id}-${index}`}
              href={category.href}
              className="group relative block flex-shrink-0"
              onMouseEnter={() => setHoveredCategory(`${category.id}-${index}`)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="relative w-80 h-96 overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-xl">
                <div className="relative h-80 overflow-hidden rounded-t-2xl">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="320px"
                  />
                </div>

                <div className="relative h-16 bg-white flex items-center justify-between px-6 border-t border-gray-100">
                  <h3 className="text-base font-normal text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                    {category.name}
                  </h3>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      hoveredCategory === `${category.id}-${index}`
                        ? "bg-gray-900 border border-gray-900"
                        : "bg-white border border-gray-200 hover:border-gray-300"
                    }`}
                    style={{
                      boxShadow:
                        hoveredCategory === `${category.id}-${index}`
                          ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                          : "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <ArrowUpRight
                      className={`h-4 w-4 transition-all duration-300 ${
                        hoveredCategory === `${category.id}-${index}` ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                <div
                  className={`absolute inset-0 bg-black/5 transition-opacity duration-300 rounded-2xl ${
                    hoveredCategory === `${category.id}-${index}` ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows - moved to bottom-right corner */}
        <div className="absolute right-6 bottom-6 z-30 flex flex-col gap-3">
          <button
            aria-label="Scroll left"
            title="Scroll left"
            onClick={() => scrollCarousel("left")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") scrollCarousel("left")
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C53D39]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            aria-label="Scroll right"
            title="Scroll right"
            onClick={() => scrollCarousel("right")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") scrollCarousel("right")
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C53D39]"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
