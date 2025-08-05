"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface Category {
  id: string
  name: string
  image: string
  href: string
  description: string
}

const categories: Category[] = [
  {
    id: "office-table",
    name: "Office Table",
    image: "/categories/office-table.jpeg",
    href: "/category/office-tables",
    description: "Professional workspace solutions",
  },
  {
    id: "study-table",
    name: "Study Table",
    image: "/categories/study-table.webp",
    href: "/category/study-tables",
    description: "Perfect for learning and productivity",
  },
  {
    id: "bed",
    name: "Bed",
    image: "/categories/bed.jpeg",
    href: "/category/beds",
    description: "Comfortable sleeping solutions",
  },
  {
    id: "tea-trolly",
    name: "Tea Trolly",
    image: "/categories/tea-trolly.jpeg",
    href: "/category/tea-trolleys",
    description: "Elegant serving solutions",
  },
  {
    id: "office-decor",
    name: "Office Decor",
    image: "/categories/office-decor.jpeg",
    href: "/category/office-decor",
    description: "Enhance your workspace aesthetics",
  },
  {
    id: "center-table",
    name: "Center Table",
    image: "/categories/center-table.jpeg",
    href: "/category/center-tables",
    description: "Stylish living room centerpieces",
  },
  {
    id: "workstation",
    name: "Workstation",
    image: "/categories/workstation.jpeg",
    href: "/category/workstations",
    description: "Complete office solutions",
  },
  {
    id: "office-chair",
    name: "Office Chair",
    image: "/categories/office-chair.webp",
    href: "/category/office-chairs",
    description: "Ergonomic seating comfort",
  },
  {
    id: "dining-table",
    name: "Dining Table",
    image: "/categories/dining-table.jpeg",
    href: "/category/dining-tables",
    description: "Family gathering spaces",
  },
]

export function FurnitureCategoriesGrid() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // Adjust speed as needed

    const animate = () => {
      scrollPosition += scrollSpeed

      // Reset position when we've scrolled past the first set of items
      if (scrollPosition >= carousel.scrollWidth / 2) {
        scrollPosition = 0
      }

      carousel.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    // Start animation when component is in view
    if (isInView) {
      animationId = requestAnimationFrame(animate)
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isInView])

  // Duplicate categories for seamless loop
  const duplicatedCategories = [...categories, ...categories]

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Section Header - Contained */}
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive collection of premium furniture for every space
          </p>
        </div>
      </div>

      {/* Full-Width Horizontal Scrolling Carousel */}
      <div className="relative w-full">
        <div
          ref={carouselRef}
          className={`flex gap-6 overflow-hidden pb-8 transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100" : "opacity-0"
          }`}
          style={{
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
            paddingLeft: "2rem", // Start padding to show partial cards
            paddingRight: "2rem", // End padding to show partial cards
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
                {/* Main Image */}
                <div className="relative h-80 overflow-hidden rounded-t-2xl">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    sizes="320px"
                  />
                </div>

                {/* Category Name and Arrow Section */}
                <div className="relative h-16 bg-white flex items-center justify-between px-6 border-t border-gray-100">
                  <h3 className="text-base font-normal text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                    {category.name}
                  </h3>

                  {/* Perfect Round Arrow Button - Bottom Right */}
                  <div className="relative">
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
                </div>

                {/* Hover Overlay */}
                <div
                  className={`absolute inset-0 bg-black/5 transition-opacity duration-300 rounded-2xl ${
                    hoveredCategory === `${category.id}-${index}` ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
