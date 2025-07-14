"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Zap, Star } from "lucide-react"

export function OfficeBannerSection() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredBanner, setHoveredBanner] = useState<string | null>(null)
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
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Grid Layout - Two Banners Side by Side */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Left Banner - Office Chair Collection */}
            <Link
              href="/category/office-chairs"
              className="group relative block"
              onMouseEnter={() => setHoveredBanner("chairs")}
              onMouseLeave={() => setHoveredBanner(null)}
            >
              <div
                className="relative h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl"
                style={{ borderRadius: "7px" }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop"
                    alt="Premium Office Chairs"
                    fill
                    className="object-cover opacity-60 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105"
                    style={{ borderRadius: "7px" }}
                  />
                </div>

                {/* Futuristic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated Inner Border - Drawing Effect */}
                <div
                  className={`absolute transition-opacity duration-500 ${
                    hoveredBanner === "chairs" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    top: "40px",
                    left: "40px",
                    right: "40px",
                    bottom: "40px",
                    borderRadius: "7px",
                  }}
                >
                  {/* Top Border */}
                  <div
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] animate-draw-top"
                    style={{
                      width: hoveredBanner === "chairs" ? "100%" : "0%",
                      transition: "width 0.8s ease-out",
                    }}
                  ></div>

                  {/* Right Border */}
                  <div
                    className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39] animate-draw-right"
                    style={{
                      height: hoveredBanner === "chairs" ? "100%" : "0%",
                      transition: "height 0.8s ease-out 0.2s",
                    }}
                  ></div>

                  {/* Bottom Border */}
                  <div
                    className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69] animate-draw-bottom"
                    style={{
                      width: hoveredBanner === "chairs" ? "100%" : "0%",
                      transition: "width 0.8s ease-out 0.4s",
                    }}
                  ></div>

                  {/* Left Border */}
                  <div
                    className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39] animate-draw-left"
                    style={{
                      height: hoveredBanner === "chairs" ? "100%" : "0%",
                      transition: "height 0.8s ease-out 0.6s",
                    }}
                  ></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 relative z-10">
                  {/* Badge */}
                  <div className="mb-6">
                    <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>OFFICE COLLECTION 2024</span>
                    </span>
                  </div>

                  {/* Main Text */}
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                      <span className="block">PREMIUM</span>
                      <span className="block bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                        OFFICE CHAIRS
                      </span>
                    </h2>

                    <p className="text-white/80 text-lg font-medium">ERGONOMIC COMFORT MEETS STYLE</p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <div className="group/btn bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-[#F1BA69] rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-[#C53D39] rounded-full animate-bounce opacity-40"></div>
              </div>
            </Link>

            {/* Right Banner - Office Furniture Sale */}
            <Link
              href="/category/office-furniture"
              className="group relative block"
              onMouseEnter={() => setHoveredBanner("furniture")}
              onMouseLeave={() => setHoveredBanner(null)}
            >
              <div
                className="relative h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl"
                style={{ borderRadius: "7px" }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
                    alt="Office Furniture Collection"
                    fill
                    className="object-cover opacity-60 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105"
                    style={{ borderRadius: "7px" }}
                  />
                </div>

                {/* Futuristic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F1BA69]/20 to-[#C53D39]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated Inner Border - Drawing Effect */}
                <div
                  className={`absolute transition-opacity duration-500 ${
                    hoveredBanner === "furniture" ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    top: "40px",
                    left: "40px",
                    right: "40px",
                    bottom: "40px",
                    borderRadius: "7px",
                  }}
                >
                  {/* Top Border */}
                  <div
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69]"
                    style={{
                      width: hoveredBanner === "furniture" ? "100%" : "0%",
                      transition: "width 0.8s ease-out",
                    }}
                  ></div>

                  {/* Right Border */}
                  <div
                    className="absolute top-0 right-0 w-0.5 bg-gradient-to-b from-[#F1BA69] to-[#C53D39]"
                    style={{
                      height: hoveredBanner === "furniture" ? "100%" : "0%",
                      transition: "height 0.8s ease-out 0.2s",
                    }}
                  ></div>

                  {/* Bottom Border */}
                  <div
                    className="absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-[#C53D39] to-[#F1BA69]"
                    style={{
                      width: hoveredBanner === "furniture" ? "100%" : "0%",
                      transition: "width 0.8s ease-out 0.4s",
                    }}
                  ></div>

                  {/* Left Border */}
                  <div
                    className="absolute bottom-0 left-0 w-0.5 bg-gradient-to-t from-[#F1BA69] to-[#C53D39]"
                    style={{
                      height: hoveredBanner === "furniture" ? "100%" : "0%",
                      transition: "height 0.8s ease-out 0.6s",
                    }}
                  ></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 relative z-10">
                  {/* Badge */}
                  <div className="mb-6">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold tracking-wide flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>MEGA SALE</span>
                    </span>
                  </div>

                  {/* Main Text */}
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                      <span className="block">50% OFF</span>
                      <span className="block bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                        OFFICE FURNITURE
                      </span>
                    </h2>

                    <p className="text-white/80 text-lg font-medium">HURRY UP - LIMITED TIME OFFER</p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <div className="group/btn bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                      <span>Shop Sale Now</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-[#F1BA69] rounded-full animate-bounce opacity-40"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced CSS for Drawing Animation */}
      <style jsx global>{`
        @keyframes draw-border {
          from {
            stroke-dasharray: 0 1000;
          }
          to {
            stroke-dasharray: 1000 0;
          }
        }

        .animate-draw-top {
          transform-origin: left;
        }

        .animate-draw-right {
          transform-origin: top;
        }

        .animate-draw-bottom {
          transform-origin: right;
        }

        .animate-draw-left {
          transform-origin: bottom;
        }
      `}</style>
    </section>
  )
}
