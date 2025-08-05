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
    price: number
    originalPrice?: number
    image: string
    description: string
  }
}

const hotspots: Hotspot[] = [
  {
    id: "sofa",
    x: 35,
    y: 60,
    product: {
      name: "Modular Sectional Sofa",
      price: 2299.99,
      originalPrice: 2899.99,
      image: "/backgrounds/herosec.jpg",
      description: "Premium rust-colored modular sofa with contemporary design and superior comfort",
    },
  },
  {
    id: "side-table",
    x: 65,
    y: 55,
    product: {
      name: "Cone Side Table",
      price: 399.99,
      originalPrice: 499.99,
      image: "/backgrounds/herosec.jpg",
      description: "Modern blue cone-shaped side table with sleek geometric design",
    },
  },
  {
    id: "pendant-light",
    x: 75,
    y: 25,
    product: {
      name: "Copper Mesh Pendant Light",
      price: 299.99,
      image: "/backgrounds/herosec.jpg",
      description: "Industrial copper mesh pendant light with warm ambient lighting",
    },
  },
]

export function HotspotHeroSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <section className="relative w-full h-screen bg-gray-50 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/backgrounds/herosec.jpg"
          alt="Modern Living Room Setup"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Hotspots */}
      {hotspots.map((hotspot) => (
        <div key={hotspot.id} className="absolute z-20">
          {/* Hotspot Marker */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
            }}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {/* Pulsing Circle */}
            <div className="relative">
              <div className="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-orange-500 animate-pulse"></div>
              <div className="absolute inset-0 w-6 h-6 bg-orange-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-6 h-6 bg-orange-500/20 rounded-full animate-ping animation-delay-75"></div>
            </div>

            {/* Product Card - Shows on Hover */}
            {activeHotspot === hotspot.id && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={hotspot.product.image || "/placeholder.svg"}
                      alt={hotspot.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{hotspot.product.name}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{hotspot.product.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">${hotspot.product.price}</span>
                      {hotspot.product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${hotspot.product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                        <Heart className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
