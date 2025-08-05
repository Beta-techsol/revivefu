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
    x: 70,
    y: 20,
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
    x: 35,
    y: 45,
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
    x: 80,
    y: 60,
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
    <section className="relative w-full h-[700px] overflow-hidden bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 mt-16">
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
            {/* Left Content - New Typography Layout */}
            <div className="space-y-8 text-white">
              {/* Main Heading with Custom Typography */}
              <div className="flex items-center space-y-0">
                {/* Revitalize in Dancing Script */}
                <div className="flex flex-col">
                  <h1
                    className="text-white leading-none"
                    style={{
                      fontFamily: "Dancing Script, cursive",
                      fontSize: "150px",
                      fontWeight: 700,
                      lineHeight: "0.8",
                    }}
                  >
                    Revitalize
                  </h1>

                  {/* Your Living Area in Raleway */}
                  <div
                    className="text-white ml-4"
                    style={{
                      fontFamily: "Raleway, sans-serif",
                      fontSize: "72px",
                      fontWeight: 300,
                      lineHeight: "0.9",
                      marginTop: "-20px",
                    }}
                  >
                    <div>Your</div>
                    <div>Living Area</div>
                  </div>
                </div>
              </div>

              {/* Order Now Button */}
              <div className="pt-8">
                <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-5 rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <span>Order Now</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Content - Hotspots Area */}
            <div className="relative h-full min-h-[500px]">
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <div key={hotspot.id} className="absolute">
                  {/* Hotspot Dot */}
                  <div
                    className="absolute cursor-pointer z-20"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-white border-3 border-orange-400 shadow-lg">
                        <div className="w-full h-full rounded-full bg-orange-400/80" />
                      </div>
                      {/* Pulsing ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-orange-400/60 animate-ping" />
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <div
                    className="absolute pointer-events-none z-10"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {hotspot.position === "top" && (
                      <div
                        className="w-0.5 h-24 bg-white/80 -translate-y-12"
                        style={{ boxShadow: "0 0 10px rgba(255,255,255,0.3)" }}
                      />
                    )}
                    {hotspot.position === "left" && (
                      <div
                        className="h-0.5 w-32 bg-white/80 -translate-x-32 translate-y-0"
                        style={{ boxShadow: "0 0 10px rgba(255,255,255,0.3)" }}
                      />
                    )}
                    {hotspot.position === "right" && (
                      <div
                        className="h-0.5 w-32 bg-white/80 translate-x-5 translate-y-0"
                        style={{ boxShadow: "0 0 10px rgba(255,255,255,0.3)" }}
                      />
                    )}
                  </div>

                  {/* Hotspot Card - Always Visible */}
                  <div
                    className="absolute z-15"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: (() => {
                        switch (hotspot.position) {
                          case "top":
                            return "translate(-50%, calc(-100% - 120px))"
                          case "left":
                            return "translate(calc(-100% - 140px), -50%)"
                          case "right":
                            return "translate(40px, -50%)"
                          default:
                            return "translate(-50%, -50%)"
                        }
                      })(),
                    }}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 min-w-[260px] max-w-[280px]">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mb-4 text-white shadow-lg">
                        {hotspot.icon}
                      </div>

                      {/* Content */}
                      <h3 className="text-white text-xl font-semibold mb-2 font-raleway">{hotspot.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed font-raleway">{hotspot.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Fonts Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="preload"
        as="style"
        onLoad={(e) => {
          const link = e.target as HTMLLinkElement
          link.rel = "stylesheet"
        }}
      />
    </section>
  )
}
