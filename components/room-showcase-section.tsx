"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

interface RoomShowcase {
  id: string
  title: string
  productName: string
  image: string
  link: string
}

const roomShowcases: RoomShowcase[] = [
  {
    id: "office-room",
    title: "Living Room",
    productName: "Executive Bed Collections",
    image: "/backgrounds/bg3-1.jpg",
    link: "/shop?category=bed",
  },
  {
    id: "living-room",
    title: "Study Room",
    productName: "Modern Study Sets",
    image: "/backgrounds/reading.jpg",
    link: "/shop?category=Study",
  },
  {
    id: "study-room",
    title: "Home Decor",
    productName: "Decoration Expert",
    image: "/backgrounds/office-room.jpg",
    link: "/shop?category=study-room",
  },
  {
    id: "Sofa Sets",
    title: "BED ROOM",
    productName: "Luxury Sofas Sets",
    image: "/backgrounds/bg1-2.jpg",
    link: "/shop?category=bedroom",
  },
]

export function RoomShowcaseSection() {
  const [isInView, setIsInView] = useState(false)
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
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="w-full px-[5%]">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
              Room Collections
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover furniture solutions tailored for every space in your home
          </p>
        </div>

        {/* Room Showcase Grid - Full Width */}
        <div
          className={`w-full transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roomShowcases.map((room, index) => (
              <div
                key={room.id}
                className="group relative h-64 overflow-hidden rounded-2xl shadow-xl cursor-pointer"
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <Link href={room.link}>
                  {/* Background Image - Reduced Height, Increased Width */}
                  <div className="absolute inset-0">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.title}
                      fill
                      className="object-cover object-center transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Increased Opacity Overlay - Default State */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/60 w-1/2 transition-all duration-700 group-hover:w-full group-hover:bg-black/85"></div>

                  {/* Circle - Half on overlay, half on normal */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:opacity-0 group-hover:scale-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-[#F1BA69] to-[#FFD700] flex items-center justify-center shadow-2xl border-4 border-white">
                      <div className="text-center">
                        <div className="text-base md:text-lg font-bold text-gray-900">SHOP</div>
                        <div className="text-xs text-gray-700 font-medium">NOW</div>
                      </div>
                    </div>
                  </div>

                  {/* Text Content - Shows on Hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-8 group-hover:translate-y-0">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 text-center tracking-wide">{room.title}</h3>
                    <p className="text-base md:text-lg font-light text-center mb-4 opacity-90">{room.productName}</p>
                    <div className="flex items-center space-x-2 text-[#F1BA69]">
                      <span className="text-sm font-medium">Explore Collection</span>
                      <svg
                        className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-2 h-2 bg-[#F1BA69] rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <div className="w-2 h-2 bg-[#F1BA69] rounded-full animate-pulse"></div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            View All Collections
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
