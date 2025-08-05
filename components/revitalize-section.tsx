"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Cloud, Layers, Shield } from "lucide-react"

interface Hotspot {
  id: string
  x: number // percentage
  y: number // percentage
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const hotspots: Hotspot[] = [
  {
    id: "material",
    x: 45,
    y: 35,
    title: "Best Material",
    description: "Wool And Wool Blends",
    icon: Cloud,
  },
  {
    id: "finishing",
    x: 35,
    y: 50,
    title: "Finishing",
    description: "Polished Finish",
    icon: Layers,
  },
  {
    id: "design",
    x: 65,
    y: 45,
    title: "Modern Design",
    description: "Trendy & Comfort",
    icon: Shield,
  },
]

export function RevitalizeSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 mt-16 bg-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/10 to-[#C53D39]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left Content - Typography */}
          <div
            className={`space-y-4 transition-all duration-1000 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Revitalize in Dancing Script */}
            <h2 className="font-dancing-script text-[150px] leading-none font-bold bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
              Revitalize
            </h2>

            {/* Your Living Area in Raleway */}
            <h3 className="font-sans text-[75px] leading-none font-light text-gray-800">Your Living Area</h3>

            {/* Order Now Button */}
            <div className="pt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E5A85C] text-white px-12 py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Order Now
              </Button>
            </div>
          </div>

          {/* Right Content - Image with Hotspots */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Main Image Container */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20 z-10"></div>

              <Image
                src="/showcase/leather-armchair.jpg"
                alt="Luxury leather armchair"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Hotspots */}
              <div className="absolute inset-0 z-20">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 300" preserveAspectRatio="none">
                  {hotspots.map((hotspot) => {
                    const dotX = (hotspot.x / 100) * 300
                    const dotY = (hotspot.y / 100) * 300

                    // Calculate card position
                    let cardX = dotX
                    let cardY = dotY

                    // Adjust card position based on hotspot location
                    if (hotspot.id === "material") {
                      cardX = dotX - 100
                      cardY = dotY - 80
                    } else if (hotspot.id === "finishing") {
                      cardX = dotX - 120
                      cardY = dotY - 40
                    } else if (hotspot.id === "design") {
                      cardX = dotX + 20
                      cardY = dotY - 60
                    }

                    return (
                      <g key={hotspot.id}>
                        {/* Connecting Line */}
                        <line
                          x1={dotX}
                          y1={dotY}
                          x2={cardX + (hotspot.id === "design" ? 0 : 100)}
                          y2={cardY + 40}
                          stroke="white"
                          strokeWidth="2"
                          className="drop-shadow-sm"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Hotspot Dots and Cards */}
                {hotspots.map((hotspot) => {
                  const IconComponent = hotspot.icon
                  return (
                    <div key={hotspot.id}>
                      {/* Pulsing Dot */}
                      <div
                        className="absolute w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-30"
                        style={{
                          left: `${hotspot.x}%`,
                          top: `${hotspot.y}%`,
                        }}
                        onMouseEnter={() => setActiveHotspot(hotspot.id)}
                        onMouseLeave={() => setActiveHotspot(null)}
                      >
                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-full h-full bg-white rounded-full border-2 border-gray-200"></div>
                      </div>

                      {/* Hotspot Card */}
                      <div
                        className={`absolute z-20 transition-all duration-300 ${
                          activeHotspot === hotspot.id ? "opacity-100 scale-100" : "opacity-90 scale-95"
                        }`}
                        style={{
                          left: hotspot.id === "design" ? `${hotspot.x + 5}%` : `${hotspot.x - 25}%`,
                          top: `${hotspot.y - 15}%`,
                        }}
                      >
                        <div className="bg-gray-900/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl min-w-[200px]">
                          <div className="flex items-start space-x-3">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg mb-1">{hotspot.title}</h4>
                              <p className="text-gray-300 text-sm">{hotspot.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
