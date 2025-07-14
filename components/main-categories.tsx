"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface MainCategory {
  id: string
  name: string
  image: string
  productCount: number
  href: string
  size: "large" | "medium"
}

const mainCategories: MainCategory[] = [
  {
    id: "living-room",
    name: "Living Room",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    productCount: 18,
    href: "/category/living-room",
    size: "large",
  },
  {
    id: "dining-room",
    name: "Dining Room",
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&h=400&fit=crop",
    productCount: 14,
    href: "/category/dining-room",
    size: "medium",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
    productCount: 16,
    href: "/category/kitchen",
    size: "medium",
  },
  {
    id: "office",
    name: "Office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    productCount: 20,
    href: "/category/office",
    size: "medium",
  },
]

export function MainCategories() {
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
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Custom Grid Layout matching reference */}
          <div
            className={`grid grid-cols-12 grid-rows-2 gap-4 h-[600px] transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Large Card - Living Room (Left side, spans 2 rows) */}
            <Link
              href={mainCategories[0].href}
              className={`group relative col-span-12 md:col-span-6 row-span-2 overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              onMouseEnter={() => setHoveredCategory(mainCategories[0].id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={mainCategories[0].image || "/placeholder.svg"}
                  alt={mainCategories[0].name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Sequential Drawing Border - Office Banner Style */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Border - From Arrow Button Center to Left */}
                  <div
                    className="absolute top-8 right-12 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69] origin-right"
                    style={{
                      width: hoveredCategory === mainCategories[0].id ? "calc(100% - 96px)" : "0%",
                      transition: "width 0.8s ease-out 0.1s",
                    }}
                  ></div>

                  {/* Left Border - From Top to Bottom */}
                  <div
                    className="absolute top-8 left-8 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39] origin-top"
                    style={{
                      height: hoveredCategory === mainCategories[0].id ? "calc(100% - 120px)" : "0%",
                      transition: "height 0.8s ease-out 0.3s",
                    }}
                  ></div>

                  {/* Bottom Border - From Left to Category Label Center */}
                  <div
                    className="absolute bottom-16 left-8 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[0].id ? "calc(50% - 32px)" : "0%",
                      transition: "width 0.8s ease-out 0.5s",
                    }}
                  ></div>

                  {/* Bottom Border - From Category Label Center to Right */}
                  <div
                    className="absolute bottom-16 left-1/2 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[0].id ? "calc(50% - 32px)" : "0%",
                      transition: "width 0.8s ease-out 0.7s",
                    }}
                  ></div>

                  {/* Right Border - From Bottom to Arrow Button Center */}
                  <div
                    className="absolute bottom-16 right-8 w-0.5 bg-gradient-to-t from-[#C53D39] to-[#F1BA69] origin-bottom"
                    style={{
                      height: hoveredCategory === mainCategories[0].id ? "calc(100% - 120px)" : "0%",
                      transition: "height 0.8s ease-out 0.9s",
                    }}
                  ></div>
                </div>

                {/* Arrow Icon - Top Right Corner with Office Collection Style */}
                <div
                  className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredCategory === mainCategories[0].id
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-110 shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    boxShadow:
                      hoveredCategory === mainCategories[0].id
                        ? "0 0 20px rgba(197, 61, 57, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)"
                        : "none",
                  }}
                >
                  <ArrowUpRight className="h-6 w-6" />
                </div>

                {/* Product Count - Above Category Label */}
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                  <p
                    className={`text-white text-sm text-center font-medium transition-all duration-300 ${
                      hoveredCategory === mainCategories[0].id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {mainCategories[0].productCount} Products
                  </p>
                </div>

                {/* Category Label - Bottom Center (Border End Point) */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`backdrop-blur-sm px-8 py-4 rounded-full shadow-lg transition-all duration-300 ${
                      hoveredCategory === mainCategories[0].id
                        ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white"
                        : "bg-white/95 text-gray-900"
                    }`}
                    style={{
                      boxShadow:
                        hoveredCategory === mainCategories[0].id
                          ? "0 0 20px rgba(197, 61, 57, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.2)"
                          : "none",
                    }}
                  >
                    <h3 className="font-bold text-xl text-center transition-colors duration-300">
                      {mainCategories[0].name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>

            {/* Medium Card - Dining Room (Top Right) */}
            <Link
              href={mainCategories[1].href}
              className={`group relative col-span-12 md:col-span-6 row-span-1 overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "150ms" }}
              onMouseEnter={() => setHoveredCategory(mainCategories[1].id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={mainCategories[1].image || "/placeholder.svg"}
                  alt={mainCategories[1].name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Sequential Drawing Border */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Border - From Arrow Button Center to Left */}
                  <div
                    className="absolute top-6 right-10 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69] origin-right"
                    style={{
                      width: hoveredCategory === mainCategories[1].id ? "calc(100% - 80px)" : "0%",
                      transition: "width 0.6s ease-out 0.1s",
                    }}
                  ></div>

                  {/* Left Border */}
                  <div
                    className="absolute top-6 left-6 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39] origin-top"
                    style={{
                      height: hoveredCategory === mainCategories[1].id ? "calc(100% - 80px)" : "0%",
                      transition: "height 0.6s ease-out 0.3s",
                    }}
                  ></div>

                  {/* Bottom Border - To Category Label */}
                  <div
                    className="absolute bottom-12 left-6 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[1].id ? "calc(50% - 24px)" : "0%",
                      transition: "width 0.6s ease-out 0.5s",
                    }}
                  ></div>

                  <div
                    className="absolute bottom-12 left-1/2 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[1].id ? "calc(50% - 24px)" : "0%",
                      transition: "width 0.6s ease-out 0.7s",
                    }}
                  ></div>

                  {/* Right Border - Back to Arrow */}
                  <div
                    className="absolute bottom-12 right-6 w-0.5 bg-gradient-to-t from-[#C53D39] to-[#F1BA69] origin-bottom"
                    style={{
                      height: hoveredCategory === mainCategories[1].id ? "calc(100% - 80px)" : "0%",
                      transition: "height 0.6s ease-out 0.9s",
                    }}
                  ></div>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredCategory === mainCategories[1].id
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-110 shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    boxShadow:
                      hoveredCategory === mainCategories[1].id
                        ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                        : "none",
                  }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>

                {/* Product Count */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <p
                    className={`text-white text-sm text-center font-medium transition-all duration-300 ${
                      hoveredCategory === mainCategories[1].id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {mainCategories[1].productCount} Products
                  </p>
                </div>

                {/* Category Label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`backdrop-blur-sm px-6 py-3 rounded-full shadow-lg transition-all duration-300 ${
                      hoveredCategory === mainCategories[1].id
                        ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white"
                        : "bg-white/95 text-gray-900"
                    }`}
                    style={{
                      boxShadow:
                        hoveredCategory === mainCategories[1].id
                          ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                          : "none",
                    }}
                  >
                    <h3 className="font-bold text-lg text-center transition-colors duration-300">
                      {mainCategories[1].name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>

            {/* Medium Card - Kitchen (Bottom Left of Right Side) */}
            <Link
              href={mainCategories[2].href}
              className={`group relative col-span-12 md:col-span-3 row-span-1 overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
              onMouseEnter={() => setHoveredCategory(mainCategories[2].id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={mainCategories[2].image || "/placeholder.svg"}
                  alt={mainCategories[2].name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Sequential Drawing Border */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Border */}
                  <div
                    className="absolute top-6 right-10 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69] origin-right"
                    style={{
                      width: hoveredCategory === mainCategories[2].id ? "calc(100% - 70px)" : "0%",
                      transition: "width 0.5s ease-out 0.1s",
                    }}
                  ></div>

                  {/* Left Border */}
                  <div
                    className="absolute top-6 left-5 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39] origin-top"
                    style={{
                      height: hoveredCategory === mainCategories[2].id ? "calc(100% - 70px)" : "0%",
                      transition: "height 0.5s ease-out 0.3s",
                    }}
                  ></div>

                  {/* Bottom Border */}
                  <div
                    className="absolute bottom-12 left-5 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[2].id ? "calc(50% - 20px)" : "0%",
                      transition: "width 0.5s ease-out 0.5s",
                    }}
                  ></div>

                  <div
                    className="absolute bottom-12 left-1/2 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[2].id ? "calc(50% - 20px)" : "0%",
                      transition: "width 0.5s ease-out 0.7s",
                    }}
                  ></div>

                  {/* Right Border */}
                  <div
                    className="absolute bottom-12 right-5 w-0.5 bg-gradient-to-t from-[#C53D39] to-[#F1BA69] origin-bottom"
                    style={{
                      height: hoveredCategory === mainCategories[2].id ? "calc(100% - 70px)" : "0%",
                      transition: "height 0.5s ease-out 0.9s",
                    }}
                  ></div>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredCategory === mainCategories[2].id
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-110 shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    boxShadow:
                      hoveredCategory === mainCategories[2].id
                        ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                        : "none",
                  }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>

                {/* Product Count */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <p
                    className={`text-white text-sm text-center font-medium transition-all duration-300 ${
                      hoveredCategory === mainCategories[2].id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {mainCategories[2].productCount} Products
                  </p>
                </div>

                {/* Category Label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                      hoveredCategory === mainCategories[2].id
                        ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white"
                        : "bg-white/95 text-gray-900"
                    }`}
                    style={{
                      boxShadow:
                        hoveredCategory === mainCategories[2].id
                          ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                          : "none",
                    }}
                  >
                    <h3 className="font-bold text-base text-center transition-colors duration-300">
                      {mainCategories[2].name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>

            {/* Medium Card - Office (Bottom Right of Right Side) */}
            <Link
              href={mainCategories[3].href}
              className={`group relative col-span-12 md:col-span-3 row-span-1 overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "450ms" }}
              onMouseEnter={() => setHoveredCategory(mainCategories[3].id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {/* Image Container */}
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={mainCategories[3].image || "/placeholder.svg"}
                  alt={mainCategories[3].name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                />

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300"></div>

                {/* Sequential Drawing Border */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top Border */}
                  <div
                    className="absolute top-6 right-10 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69] origin-right"
                    style={{
                      width: hoveredCategory === mainCategories[3].id ? "calc(100% - 70px)" : "0%",
                      transition: "width 0.5s ease-out 0.1s",
                    }}
                  ></div>

                  {/* Left Border */}
                  <div
                    className="absolute top-6 left-5 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39] origin-top"
                    style={{
                      height: hoveredCategory === mainCategories[3].id ? "calc(100% - 70px)" : "0%",
                      transition: "height 0.5s ease-out 0.3s",
                    }}
                  ></div>

                  {/* Bottom Border */}
                  <div
                    className="absolute bottom-12 left-5 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[3].id ? "calc(50% - 20px)" : "0%",
                      transition: "width 0.5s ease-out 0.5s",
                    }}
                  ></div>

                  <div
                    className="absolute bottom-12 left-1/2 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] origin-left"
                    style={{
                      width: hoveredCategory === mainCategories[3].id ? "calc(50% - 20px)" : "0%",
                      transition: "width 0.5s ease-out 0.7s",
                    }}
                  ></div>

                  {/* Right Border */}
                  <div
                    className="absolute bottom-12 right-5 w-0.5 bg-gradient-to-t from-[#C53D39] to-[#F1BA69] origin-bottom"
                    style={{
                      height: hoveredCategory === mainCategories[3].id ? "calc(100% - 70px)" : "0%",
                      transition: "height 0.5s ease-out 0.9s",
                    }}
                  ></div>
                </div>

                {/* Arrow Icon */}
                <div
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredCategory === mainCategories[3].id
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-110 shadow-lg"
                      : "bg-white/80 backdrop-blur-sm text-gray-700 opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    boxShadow:
                      hoveredCategory === mainCategories[3].id
                        ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                        : "none",
                  }}
                >
                  <ArrowUpRight className="h-5 w-5" />
                </div>

                {/* Product Count */}
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                  <p
                    className={`text-white text-sm text-center font-medium transition-all duration-300 ${
                      hoveredCategory === mainCategories[3].id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    {mainCategories[3].productCount} Products
                  </p>
                </div>

                {/* Category Label */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`backdrop-blur-sm px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
                      hoveredCategory === mainCategories[3].id
                        ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white"
                        : "bg-white/95 text-gray-900"
                    }`}
                    style={{
                      boxShadow:
                        hoveredCategory === mainCategories[3].id
                          ? "0 0 15px rgba(197, 61, 57, 0.4), inset 0 0 8px rgba(255, 255, 255, 0.2)"
                          : "none",
                    }}
                  >
                    <h3 className="font-bold text-base text-center transition-colors duration-300">
                      {mainCategories[3].name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
