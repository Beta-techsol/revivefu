"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Sparkles, Palette, Award } from "lucide-react"

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  title: string
  subtitle: string
  icon: React.ReactNode
  position: "top" | "left" | "right" | "bottom"
}

const hotspots: Hotspot[] = [
  {
    id: "material",
    x: 75,
    y: 25,
    title: "Best Material",
    subtitle: "Wool And Wool Blends",
    icon: <Award className="w-6 h-6" />,
    position: "top",
  },
  {
    id: "finishing",
    x: 45,
    y: 55,
    title: "Finishing",
    subtitle: "Polished Finish",
    icon: <Palette className="w-6 h-6" />,
    position: "left",
  },
  {
    id: "design",
    x: 85,
    y: 65,
    title: "Modern Design",
    subtitle: "Trendy & Comfort",
    icon: <Sparkles className="w-6 h-6" />,
    position: "right",
  },
]

export function RevitalizeSection() {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/showcase/leather-armchair.jpg"
          alt="Luxury leather armchair showcase"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-white">
              {/* Small Title */}
              <div className="flex items-center space-x-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <span className="text-orange-400 font-medium tracking-wider text-sm uppercase">
                  TRANSFORM YOUR HOUSE
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-light leading-tight">
                Revitalize Your Living
                <br />
                <span className="font-normal">Area</span>
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquet nisl nec eros venenatis, ac
                lacinia justo vulputate. Ut vestibulum, mauris eu mattis rutrum, leo magna eleifend justo, et fringilla
                velit purus vel nisl. Morbi dignissim tristique lorem, ac vehicula odio luctus eu.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <button className="group border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-white/10 backdrop-blur-sm">
                  <span>Explore More</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Content - Hotspots Area */}
            <div className="relative h-full min-h-[400px]">
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <div
                  key={hotspot.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                >
                  {/* Hotspot Dot */}
                  <div className="relative">
                    <div
                      className={`
                        w-4 h-4 rounded-full bg-white border-2 border-orange-400 
                        transition-all duration-300 hover:scale-125
                        ${hoveredHotspot === hotspot.id ? "animate-pulse scale-125" : ""}
                      `}
                    >
                      <div className="w-full h-full rounded-full bg-orange-400/60" />
                    </div>

                    {/* Ripple Effect */}
                    <div
                      className={`
                        absolute inset-0 rounded-full border-2 border-orange-400/50
                        animate-ping
                        ${hoveredHotspot === hotspot.id ? "opacity-100" : "opacity-0"}
                      `}
                    />
                  </div>

                  {/* Hotspot Card */}
                  <div
                    className={`
                      absolute z-10 transition-all duration-300
                      ${hotspot.position === "top" ? "bottom-full mb-4 left-1/2 -translate-x-1/2" : ""}
                      ${hotspot.position === "left" ? "right-full mr-4 top-1/2 -translate-y-1/2" : ""}
                      ${hotspot.position === "right" ? "left-full ml-4 top-1/2 -translate-y-1/2" : ""}
                      ${hotspot.position === "bottom" ? "top-full mt-4 left-1/2 -translate-x-1/2" : ""}
                      ${hoveredHotspot === hotspot.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                    `}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 min-w-[280px]">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-4 text-white">
                        {hotspot.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-white text-xl font-semibold mb-2">{hotspot.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{hotspot.subtitle}</p>
                    </div>

                    {/* Arrow pointing to hotspot */}
                    <div
                      className={`
                        absolute w-0 h-0 border-8 border-transparent
                        ${hotspot.position === "top" ? "top-full left-1/2 -translate-x-1/2 border-t-gray-900/95" : ""}
                        ${hotspot.position === "left" ? "left-full top-1/2 -translate-y-1/2 border-l-gray-900/95" : ""}
                        ${hotspot.position === "right" ? "right-full top-1/2 -translate-y-1/2 border-r-gray-900/95" : ""}
                        ${hotspot.position === "bottom" ? "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900/95" : ""}
                      `}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
