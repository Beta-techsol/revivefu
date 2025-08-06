"use client"

import { useState } from "react"
import Image from "next/image"

const curatedItems = [
  {
    id: 1,
    image: "/curated/wooden-sofa.avif",
    subtitle: "Mid-Century Modern",
    title: "Wooden Living Set",
    description: "Timeless design meets contemporary comfort"
  },
  {
    id: 2,
    image: "/curated/wooden-sideboard.avif",
    subtitle: "Storage Solutions",
    title: "Wooden Sideboard",
    description: "Elegant storage with natural wood finish"
  },
  {
    id: 3,
    image: "/curated/sidetable.avif",
    subtitle: "Accent Furniture",
    title: "Designer Side Table",
    description: "Perfect blend of style and functionality"
  }
]

const mainShowcase = {
  image: "/curated/fabric-sofa.avif",
  subtitle: "Living Room Collection",
  title: "Modern Sectional Sofa",
  description: "Transform your space with luxury comfort"
}

export function CuratedPicksSection() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [hoveredMain, setHoveredMain] = useState(false)

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-[3%]">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-3">
            The Ultimate Furniture Edit
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
            CURATED PICKS TO ELEVATE
          </h2>
        </div>

        {/* Three Images Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {curatedItems.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className={`object-cover transition-all duration-700 ease-out ${
                  hoveredItem === item.id 
                    ? 'scale-110 blur-sm' 
                    : 'scale-100 blur-0'
                }`}
              />
              
              {/* Blur Overlay with Animation */}
              <div 
                className={`absolute inset-0 transition-all duration-700 ease-out ${
                  hoveredItem === item.id 
                    ? 'bg-black/20 backdrop-blur-[2px]' 
                    : 'bg-transparent backdrop-blur-0'
                }`}
              />
              
              {/* Animated Blur Effect */}
              <div 
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  hoveredItem === item.id 
                    ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse' 
                    : 'opacity-0'
                }`}
              />

              {/* Content Overlay */}
              <div 
                className={`absolute inset-0 flex flex-col justify-center items-center text-center p-6 transition-all duration-500 ease-out ${
                  hoveredItem === item.id 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="text-sm font-medium text-white/90 tracking-wider uppercase mb-2">
                  {item.subtitle}
                </p>
                <h3 className="text-xl md:text-2xl font-light text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-white/80 max-w-xs">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Width Sofa Image */}
        <div
          className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer group"
          onMouseEnter={() => setHoveredMain(true)}
          onMouseLeave={() => setHoveredMain(false)}
        >
          <Image
            src={mainShowcase.image || "/placeholder.svg"}
            alt={mainShowcase.title}
            fill
            className={`object-cover transition-all duration-700 ease-out ${
              hoveredMain 
                ? 'scale-110 blur-sm' 
                : 'scale-100 blur-0'
            }`}
          />
          
          {/* Blur Overlay with Animation */}
          <div 
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              hoveredMain 
                ? 'bg-black/20 backdrop-blur-[2px]' 
                : 'bg-transparent backdrop-blur-0'
            }`}
          />
          
          {/* Animated Blur Effect */}
          <div 
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              hoveredMain 
                ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse' 
                : 'opacity-0'
            }`}
          />

          {/* Content Overlay */}
          <div 
            className={`absolute inset-0 flex flex-col justify-center items-center text-center p-8 transition-all duration-500 ease-out ${
              hoveredMain 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-sm md:text-base font-medium text-white/90 tracking-wider uppercase mb-3">
              {mainShowcase.subtitle}
            </p>
            <h3 className="text-2xl md:text-4xl font-light text-white mb-4">
              {mainShowcase.title}
            </h3>
            <p className="text-sm md:text-base text-white/80 max-w-md">
              {mainShowcase.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
