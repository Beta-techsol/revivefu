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
    x: 45,
    y: 35,
    title: "Best Material",
    subtitle: "Wool And Wool Blends",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15 10.1 14.1 11 13 11S11 10.1 11 9V7.5L5 7V9C5 10.1 4.1 11 3 11S1 10.1 1 9V7C1 5.9 1.9 5 3 5H21C22.1 5 23 5.9 23 7V9C23 10.1 22.1 11 21 11S19 10.1 19 9Z"
          fill="currentColor"
        />
      </svg>
    ),
    position: "top",
  },
  {
    id: "finishing",
    x: 35,
    y: 50,
    title: "Finishing",
    subtitle: "Polished Finish",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="18" height="3" rx="1" fill="currentColor" />
        <rect x="3" y="8" width="18" height="3" rx="1" fill="currentColor" />
        <rect x="3" y="13" width="18" height="3" rx="1" fill="currentColor" />
        <rect x="3" y="18" width="18" height="3" rx="1" fill="currentColor" />
      </svg>
    ),
    position: "left",
  },
  {
    id: "design",
    x: 65,
    y: 45,
    title: "Modern Design",
    subtitle: "Trendy & Comfort",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.5 12C17.5 12.69 17.19 13.29 16.69 13.69C16.29 14.19 15.69 14.5 15 14.5H9C8.31 14.5 7.71 14.19 7.31 13.69C6.81 13.29 6.5 12.69 6.5 12C6.5 11.31 6.81 10.71 7.31 10.31C7.71 9.81 8.31 9.5 9 9.5H15C15.69 9.5 16.29 9.81 16.69 10.31C17.19 10.71 17.5 11.31 17.5 12ZM12 2C13.1 2 14 2.9 14 4V6H10V4C10 2.9 10.9 2 12 2ZM12 18C10.9 18 10 18.9 10 20V22H14V20C14 18.9 13.1 18 12 18Z"
          fill="currentColor"
        />
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Typography */}
            <div className="space-y-8 text-white">
              {/* Main Typography - Stacked Vertically */}
              <div className="space-y-4">
                {/* Revitalize in Dancing Script */}
                <h1
                  className="text-white leading-none"
                  style={{
                    fontFamily: "Dancing Script, cursive",
                    fontSize: "150px",
                    fontWeight: 700,
                  }}
                >
                  Revitalize
                </h1>

                {/* Your Living Area in Raleway - One Line */}
                <div
                  className="text-white leading-tight"
                  style={{
                    fontFamily: "Raleway, sans-serif",
                    fontSize: "75px",
                    fontWeight: 300,
                  }}
                >
                  Your Living Area
                </div>
              </div>

              {/* Order Now Button */}
              <div className="pt-8">
                <button className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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
                    className="absolute cursor-pointer group z-20"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="relative">
                      {/* Pulsing outer ring */}
                      <div className="absolute inset-0 w-6 h-6 rounded-full bg-white/30 animate-ping"></div>
                      {/* Main dot */}
                      <div className="relative w-6 h-6 rounded-full bg-white border-2 border-white shadow-lg">
                        <div className="w-full h-full rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  <svg
                    className="absolute pointer-events-none z-10"
                    width="300"
                    height="300"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {hotspot.position === "top" && (
                      <line x1="150" y1="150" x2="150" y2="50" stroke="white" strokeWidth="2" strokeDasharray="none" />
                    )}
                    {hotspot.position === "left" && (
                      <line x1="150" y1="150" x2="50" y2="150" stroke="white" strokeWidth="2" strokeDasharray="none" />
                    )}
                    {hotspot.position === "right" && (
                      <line x1="150" y1="150" x2="250" y2="150" stroke="white" strokeWidth="2" strokeDasharray="none" />
                    )}
                  </svg>

                  {/* Hotspot Card */}
                  <div
                    className="absolute z-30"
                    style={{
                      left: `${hotspot.x}%`,
                      top: `${hotspot.y}%`,
                      transform: (() => {
                        switch (hotspot.position) {
                          case "top":
                            return "translate(-50%, calc(-100% - 100px))"
                          case "left":
                            return "translate(calc(-100% - 100px), -50%)"
                          case "right":
                            return "translate(100px, -50%)"
                          default:
                            return "translate(-50%, -50%)"
                        }
                      })(),
                    }}
                  >
                    <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-600/30 min-w-[250px]">
                      {/* Icon */}
                      <div className="flex items-center justify-center w-16 h-16 bg-black rounded-xl mb-4 text-white">
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

      {/* Add Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap');
      `}</style>
    </section>
  )
}
