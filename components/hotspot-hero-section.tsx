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
    x: 45, // moved 200px more left (approximately 20% less)
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

  const getCardPosition = (hotspotId: string) => {
    if (hotspotId === "pendant-light") {
      return "top-8 left-1/2 transform -translate-x-1/2" // Show below the lamp
    }
    return "bottom-8 left-1/2 transform -translate-x-1/2" // Default position above hotspot
  }

  const getArrowPosition = (hotspotId: string) => {
    if (hotspotId === "pendant-light") {
      return "bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white" // Arrow pointing up
    }
    return "top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" // Arrow pointing down
  }

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

              {/* Product Details Card - Shows on Hover */}
              {activeHotspot === hotspot.id && (
                <div
                  className={`absolute ${getCardPosition(hotspot.id)} w-80 bg-white rounded-xl shadow-2xl p-6 border border-gray-100 z-50 animate-in slide-in-from-bottom-2 duration-200`}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{hotspot.product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{hotspot.product.description}</p>

                    <div className="flex items-center justify-center gap-3 mb-6">
                      <span className="text-2xl font-bold text-orange-600">{hotspot.product.price}</span>
                      {hotspot.product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">{hotspot.product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:border-orange-500 hover:text-orange-500 px-4 py-2 rounded-lg transition-all duration-200 bg-transparent"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 hover:border-orange-500 hover:text-orange-500 px-4 py-2 rounded-lg transition-all duration-200 bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Quick View
                      </Button>
                    </div>
                  </div>

                  {/* Arrow pointing to hotspot */}
                  <div className={`absolute ${getArrowPosition(hotspot.id)}`}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
