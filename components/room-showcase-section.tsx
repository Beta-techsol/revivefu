"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

interface RoomShowcase {
  id: string
  title: string
  subtitle: string
  price: string
  image: string
  link: string
  overlayColor?: string
}

const roomShowcases: RoomShowcase[] = [
  {
    id: "office-room",
    title: "OFFICE ROOM",
    subtitle: "IN THE",
    price: "45$",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/office-room.jpg-NfiXoVn3M19Oe5vtdPN3iyaSSpMUNQ.jpeg",
    link: "/shop?category=office",
  },
  {
    id: "living-room",
    title: "LIVING ROOM",
    subtitle: "IN THE",
    price: "55$",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bg1-2.jpg-l4C1IcsdjtJReVuL4cJLWFBgd514cP.jpeg",
    link: "/shop?category=living-room",
  },
  {
    id: "study-room",
    title: "STUDY ROOM",
    subtitle: "IN THE",
    price: "25$",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reading.jpg-7fGN92WFWrg91Y9wmrEAHyX1EcxIk9.jpeg",
    link: "/shop?category=study-room",
  },
  {
    id: "bed-room",
    title: "BED ROOM",
    subtitle: "WE ARE SOFANI",
    price: "35$",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bg3-1.jpg-iguQqMIywzUbhhW6Fc1kC8aOIed5mi.jpeg",
    link: "/shop?category=bedroom",
    overlayColor: "from-purple-500 to-pink-500",
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
              Room Collections
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover furniture solutions tailored for every space in your home
          </p>
        </div>

        {/* Room Showcase Grid */}
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomShowcases.map((room, index) => (
              <div
                key={room.id}
                className="group relative h-80 overflow-hidden rounded-lg shadow-lg cursor-pointer"
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <Link href={room.link}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={room.image || "/placeholder.svg"}
                      alt={room.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Half Overlay - Default State */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/80 group-hover:via-black/60 group-hover:to-black/40"></div>

                  {/* Full Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-between p-8">
                    {/* Left Side - Text Content */}
                    <div className="text-white z-10">
                      <div className="mb-2">
                        <p className="text-sm font-light tracking-wider opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          {room.subtitle}
                        </p>
                      </div>
                      <div className="transform transition-all duration-500 group-hover:translate-x-2">
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight tracking-wide">
                          {room.title.split(" ").map((word, i) => (
                            <div key={i} className="block">
                              {word}
                            </div>
                          ))}
                        </h3>
                      </div>

                      {/* Special styling for bedroom */}
                      {room.id === "bed-room" && (
                        <div className="mt-4">
                          <div
                            className={`inline-block px-4 py-2 rounded text-white font-semibold text-sm bg-gradient-to-r ${room.overlayColor || "from-purple-500 to-pink-500"} transform transition-all duration-300 group-hover:scale-105`}
                          >
                            {room.title}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Side - Price Circle (Half Overlayed) */}
                    <div className="relative">
                      {/* Price Circle */}
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-[#F1BA69] to-[#FFD700] flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative z-20">
                        <div className="text-center">
                          <div className="text-xl md:text-2xl font-bold text-gray-900">{room.price}</div>
                          <div className="text-xs text-gray-700 font-medium">FROM</div>
                        </div>
                      </div>

                      {/* Glow Effect on Hover */}
                      <div className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-[#F1BA69] to-[#FFD700] opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 transform group-hover:scale-150"></div>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute bottom-4 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <div className="flex items-center space-x-2 text-white">
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
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
