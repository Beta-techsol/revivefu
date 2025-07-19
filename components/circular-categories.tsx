"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface Category {
  id: string
  name: string
  image: string
  productCount: number
  href: string
}

const categories: Category[] = [
  {
    id: "sofas",
    name: "Sofas",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    productCount: 45,
    href: "/category/sofas",
  },
  {
    id: "chairs",
    name: "Chairs",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    productCount: 32,
    href: "/category/chairs",
  },
  {
    id: "tables",
    name: "Tables",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
    productCount: 28,
    href: "/category/tables",
  },
  {
    id: "beds",
    name: "Beds",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    productCount: 18,
    href: "/category/beds",
  },
  {
    id: "storage",
    name: "Storage",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    productCount: 25,
    href: "/category/storage",
  },
  {
    id: "decor",
    name: "Decor",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop",
    productCount: 40,
    href: "/category/decor",
  },
]

export function CircularCategories() {
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

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-16 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Responsive Layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Text Section - Top on mobile, left on desktop */}
            <div
              className={`text-center lg:text-left mb-8 sm:mb-12 lg:mb-0 transition-all duration-1000 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                Shop by{" "}
                <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto lg:mx-0 rounded-full mb-4 sm:mb-6"></div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Discover our carefully curated furniture collections designed to transform your living spaces into
                beautiful, functional environments.
              </p>
            </div>

            {/* Categories Grid - Responsive */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
            >
              {/* Mobile: 2 per row, Tablet: 3 per row, Desktop: 3 per row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={category.href}
                    className="group block"
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    style={{
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <div className="relative flex flex-col items-center text-center transition-all duration-500 transform group-hover:scale-110">
                      {/* Circular Image Container - Responsive sizes */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 mb-3 sm:mb-4">
                        {/* Gradient Border Ring */}
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] p-1 transition-all duration-500 ${
                            hoveredCategory === category.id ? "animate-pulse shadow-2xl" : "shadow-lg"
                          }`}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, (max-width: 1280px) 128px, 144px"
                            />
                          </div>
                        </div>

                        {/* Floating Animation Ring */}
                        <div
                          className={`absolute inset-0 rounded-full border-2 border-[#F1BA69]/30 transition-all duration-700 ${
                            hoveredCategory === category.id
                              ? "scale-125 opacity-100 animate-ping"
                              : "scale-100 opacity-0"
                          }`}
                        ></div>

                        {/* Product Count Badge */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                          <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                            {category.productCount}
                          </span>
                        </div>

                        {/* Hover Glow Effect */}
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20 blur-xl transition-all duration-500 ${
                            hoveredCategory === category.id ? "opacity-100 scale-150" : "opacity-0 scale-100"
                          }`}
                        ></div>
                      </div>

                      {/* Category Name - Responsive text */}
                      <h3
                        className={`font-semibold text-gray-900 text-sm sm:text-base lg:text-lg transition-all duration-300 ${
                          hoveredCategory === category.id
                            ? "text-transparent bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text transform scale-110"
                            : ""
                        }`}
                      >
                        {category.name}
                      </h3>

                      {/* Animated Underline */}
                      <div
                        className={`h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transition-all duration-300 mt-1 sm:mt-2 ${
                          hoveredCategory === category.id ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
        
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>
    </section>
  )
}
