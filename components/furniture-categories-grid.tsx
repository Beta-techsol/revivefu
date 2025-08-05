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

  // Split categories: first 5 and last 4
  const firstRowCategories = categories.slice(0, 5)
  const secondRowCategories = categories.slice(5, 9)

  return (
    <section ref={sectionRef} className="py-16 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
              Furniture
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive collection of premium furniture for every space
          </p>
        </div>

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto">
          {/* First Row - 5 Categories */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {firstRowCategories.map((category, index) => (
              <Link
                key={category.id}
                href={category.href}
                className="group relative block"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                    />
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500"></div>
                  </div>

                  {/* Arrow Icon - Top Left Corner */}
                  <div className="absolute top-4 left-4 z-20">
                    <div
                      className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-500 ${
                        hoveredCategory === category.id
                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] border-transparent scale-110"
                          : "group-hover:bg-white/30"
                      }`}
                    >
                      <ArrowUpRight
                        className={`h-5 w-5 text-white transition-all duration-300 ${
                          hoveredCategory === category.id ? "rotate-45" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content - Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#F1BA69] transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-xs group-hover:text-white transition-colors duration-300">
                        {category.description}
                      </p>
                    </div>

                    {/* Hover Effect - Sliding Line */}
                    <div className="mt-3 overflow-hidden">
                      <div
                        className={`h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transition-all duration-500 ${
                          hoveredCategory === category.id ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Animated Border on Hover */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      hoveredCategory === category.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {/* Top Border */}
                    <div
                      className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69]"
                      style={{
                        width: hoveredCategory === category.id ? "100%" : "0%",
                        transition: "width 0.8s ease-out",
                      }}
                    ></div>
                    {/* Right Border */}
                    <div
                      className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39]"
                      style={{
                        height: hoveredCategory === category.id ? "100%" : "0%",
                        transition: "height 0.8s ease-out 0.2s",
                      }}
                    ></div>
                    {/* Bottom Border */}
                    <div
                      className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69]"
                      style={{
                        width: hoveredCategory === category.id ? "100%" : "0%",
                        transition: "width 0.8s ease-out 0.4s",
                      }}
                    ></div>
                    {/* Left Border */}
                    <div
                      className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39]"
                      style={{
                        height: hoveredCategory === category.id ? "100%" : "0%",
                        transition: "height 0.8s ease-out 0.6s",
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Second Row - 4 Categories (Centered) */}
          <div className="flex justify-center">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl transition-all duration-1000 delay-500 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {secondRowCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={category.href}
                  className="group relative block"
                  onMouseEnter={() => setHoveredCategory(category.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    transitionDelay: `${(index + 5) * 100}ms`,
                  }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {/* Background Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-500"></div>
                    </div>

                    {/* Arrow Icon - Top Left Corner */}
                    <div className="absolute top-4 left-4 z-20">
                      <div
                        className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-500 ${
                          hoveredCategory === category.id
                            ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] border-transparent scale-110"
                            : "group-hover:bg-white/30"
                        }`}
                      >
                        <ArrowUpRight
                          className={`h-5 w-5 text-white transition-all duration-300 ${
                            hoveredCategory === category.id ? "rotate-45" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Content - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#F1BA69] transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-xs group-hover:text-white transition-colors duration-300">
                          {category.description}
                        </p>
                      </div>

                      {/* Hover Effect - Sliding Line */}
                      <div className="mt-3 overflow-hidden">
                        <div
                          className={`h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transition-all duration-500 ${
                            hoveredCategory === category.id ? "w-full" : "w-0"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Animated Border on Hover */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        hoveredCategory === category.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {/* Top Border */}
                      <div
                        className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69]"
                        style={{
                          width: hoveredCategory === category.id ? "100%" : "0%",
                          transition: "width 0.8s ease-out",
                        }}
                      ></div>
                      {/* Right Border */}
                      <div
                        className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCategory === category.id ? "100%" : "0%",
                          transition: "height 0.8s ease-out 0.2s",
                        }}
                      ></div>
                      {/* Bottom Border */}
                      <div
                        className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69]"
                        style={{
                          width: hoveredCategory === category.id ? "100%" : "0%",
                          transition: "width 0.8s ease-out 0.4s",
                        }}
                      ></div>
                      {/* Left Border */}
                      <div
                        className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39]"
                        style={{
                          height: hoveredCategory === category.id ? "100%" : "0%",
                          transition: "height 0.8s ease-out 0.6s",
                        }}
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
