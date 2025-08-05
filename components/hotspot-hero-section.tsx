"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart, Eye } from "lucide-react"

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  product: {
    name: string
    price: string
    originalPrice?: string
    image: string
    description: string
  }
}

const hotspots: Hotspot[] = [
  {
    id: "sofa",
    x: 30,
    y: 60,
    product: {
      name: "Modular Sectional Sofa",
      price: "PKR 229,999",
      originalPrice: "PKR 289,999",
      image: "/backgrounds/herosec.jpg",
      description: "Premium rust-colored modular sofa with contemporary design",
    },
  },
  {
    id: "pendant-light",
    x: 75,
    y: 25,
    product: {
      name: "Copper Mesh Pendant Light",
      price: "PKR 29,999",
      image: "/backgrounds/herosec.jpg",
      description: "Industrial copper mesh pendant light with warm lighting",
    },
  },
  {
    id: "side-table",
    x: 65,
    y: 75,
    product: {
      name: "Modern Side Table",
      price: "PKR 39,999",
      originalPrice: "PKR 49,999",
      image: "/backgrounds/herosec.jpg",
      description: "Sleek modern side table with geometric design",
    },
  },
]

export function HotspotHeroSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <section className="relative w-full h-[500px] bg-gray-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/herosec.jpg"
          alt="Modern Living Room Setup"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Light overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Hotspots Container */}
      <div className="absolute inset-0 z-30">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Hotspot Marker */}
            <div
              className="relative cursor-pointer group"
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              {/* Main hotspot circle */}
              <div className="relative z-40">
                <div className="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-orange-500 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>

                {/* Pulsing animation rings */}
                <div className="absolute inset-0 w-6 h-6 bg-orange-500/30 rounded-full animate-ping"></div>
                <div
                  className="absolute inset-0 w-6 h-6 bg-orange-500/20 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>

              {/* Product Card - Shows on Hover */}
              {activeHotspot === hotspot.id && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-72 bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={hotspot.product.image || "/placeholder.svg"}
                        alt={hotspot.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{hotspot.product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{hotspot.product.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-bold text-gray-900">{hotspot.product.price}</span>
                        {hotspot.product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">{hotspot.product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" className="flex-1 h-7 text-xs bg-orange-500 hover:bg-orange-600">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-transparent">
                          <Heart className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 bg-transparent">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Arrow pointing to hotspot */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simple centered text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore Our Furniture</h2>
          <p className="text-sm md:text-base opacity-90">Hover over the hotspots to discover products</p>
        </div>
      </div>
    </section>
  )
}
