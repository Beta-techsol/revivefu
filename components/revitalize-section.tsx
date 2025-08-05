"use client"

import type React from "react"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

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
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
    position: "top",
  },
  {
    id: "finishing",
    x: 45,
    y: 55,
    title: "Finishing",
    subtitle: "Polished Finish",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="4" fill="currentColor" />
        <rect x="3" y="10" width="18" height="4" fill="currentColor" />
        <rect x="3" y="17" width="18" height="4" fill="currentColor" />
      </svg>
    ),
    position: "left",
  },
  {
    id: "design",
    x: 85,
    y: 65,
    title: "Modern Design",
    subtitle: "Trendy & Comfort",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L13.09 8.26L20 9L14 14.14L15.18 21.02L12 17.77L8.82 21.02L10 14.14L4 9L10.91 8.26L12 2Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    position: "right",
  },
]

export function RevitalizeSection() {
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
                <div key={hotspot.id} className="absolute">
                  {/* Hotspot Dot */}
                  <div
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-white border-2 border-orange-400 animate-pulse">
                        <div className="w-full h-full rounded-full bg-orange-400/60" />
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <svg
                    className="absolute pointer-events-none"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {hotspot.position === "top" && (
                      <line x1="0" y1="0" x2="0" y2="-80" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {hotspot.position === "left" && (
                      <line x1="0" y1="0" x2="-120" y2="0" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {hotspot.position === "right" && (
                      <line x1="0" y1="0" x2="120" y2="0" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                    {hotspot.position === "bottom" && (
                      <line x1="0" y1="0" x2="0" y2="80" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                    )}
                  </svg>

                  {/* Hotspot Card - Always Visible */}
                  <div
                    className={`
                      absolute z-10
                      ${hotspot.position === "top" ? "bottom-full mb-4 left-1/2 -translate-x-1/2" : ""}
                      ${hotspot.position === "left" ? "right-full mr-4 top-1/2 -translate-y-1/2" : ""}
                      ${hotspot.position === "right" ? "left-full ml-4 top-1/2 -translate-y-1/2" : ""}
                      ${hotspot.position === "bottom" ? "top-full mt-4 left-1/2 -translate-x-1/2" : ""}
                    `}
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: (() => {
                        switch (hotspot.position) {
                          case "top":
                            return "translate(-50%, calc(-100% - 100px))"
                          case "left":
                            return "translate(calc(-100% - 140px), -50%)"
                          case "right":
                            return "translate(140px, -50%)"
                          case "bottom":
                            return "translate(-50%, 100px)"
                          default:
                            return "translate(-50%, -50%)"
                        }
                      })(),
                    }}
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
