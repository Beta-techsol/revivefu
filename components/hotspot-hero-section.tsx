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
      image: "/backgrounds/clean-furniture-showcase.png",
      description: "Premium rust-colored modular sofa with contemporary design and superior comfort",
    },
  },
  {
    id: "pendant-light",
    x: 85,
    y: 35,
    product: {
      name: "Copper Mesh Pendant Light",
      price: "PKR 29,999",
      image: "/backgrounds/clean-furniture-showcase.png",
      description: "Industrial copper mesh pendant light with warm ambient lighting",
    },
  },
  {
    id: "side-table",
    x: 70,
    y: 75,
    product: {
      name: "Modern Side Table",
      price: "PKR 39,999",
      originalPrice: "PKR 49,999",
      image: "/backgrounds/clean-furniture-showcase.png",
      description: "Sleek modern side table perfect for any living space",
    },
  },
]

export function HotspotHeroSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/backgrounds/clean-furniture-showcase.png"
          alt="Modern Furniture Showcase"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Hotspots Container */}
      <div className="absolute inset-0 z-10">
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
              {/* Main Hotspot Circle */}
              <div className="relative z-20">
                <div className="w-12 h-12 bg-white rounded-full shadow-xl border-4 border-orange-500 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                </div>

                {/* Pulsing Rings */}
                <div className="absolute inset-0 w-12 h-12 bg-orange-500/20 rounded-full animate-ping"></div>
                <div
                  className="absolute inset-0 w-12 h-12 bg-orange-500/10 rounded-full animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>

              {/* Product Card - Shows on Hover */}
              {activeHotspot === hotspot.id && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 z-30 animate-in slide-in-from-bottom-4 duration-300">
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
                        <span className="text-lg font-bold text-gray-900">{hotspot.product.price}</span>
                        {hotspot.product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{hotspot.product.originalPrice}</span>
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
      </div>

      {/* Optional: Instructions overlay */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <p className="text-sm text-gray-700 font-medium">Click on the hotspots to explore products</p>
        </div>
      </div>
    </section>
  )
}
