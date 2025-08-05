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
    x: 25,
    y: 65,
    product: {
      name: "Modular Sectional Sofa",
      price: "PKR 229,999",
      originalPrice: "PKR 289,999",
      image: "/backgrounds/herosec.jpg",
      description: "Premium rust-colored modular sofa with contemporary design and superior comfort",
    },
  },
  {
    id: "side-table",
    x: 70,
    y: 70,
    product: {
      name: "Cone Side Table",
      price: "PKR 39,999",
      originalPrice: "PKR 49,999",
      image: "/backgrounds/herosec.jpg",
      description: "Modern blue cone-shaped side table with sleek geometric design",
    },
  },
  {
    id: "pendant-light",
    x: 75,
    y: 20,
    product: {
      name: "Copper Mesh Pendant Light",
      price: "PKR 29,999",
      image: "/backgrounds/herosec.jpg",
      description: "Industrial copper mesh pendant light with warm ambient lighting",
    },
  },
  {
    id: "coffee-table",
    x: 45,
    y: 80,
    product: {
      name: "Glass Coffee Table",
      price: "PKR 59,999",
      originalPrice: "PKR 79,999",
      image: "/backgrounds/herosec.jpg",
      description: "Modern glass coffee table with sleek metal frame",
    },
  },
  {
    id: "wall-art",
    x: 15,
    y: 30,
    product: {
      name: "Abstract Wall Art",
      price: "PKR 19,999",
      originalPrice: "PKR 24,999",
      image: "/backgrounds/herosec.jpg",
      description: "Contemporary abstract wall art to enhance your living space",
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

      {/* Overlay for better hotspot visibility */}
      <div className="absolute inset-0 bg-black/10"></div>

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
              <div className="w-8 h-8 bg-white rounded-full shadow-lg border-3 border-orange-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>
              <div className="absolute inset-0 w-8 h-8 bg-orange-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-8 h-8 bg-orange-500/20 rounded-full animate-ping animation-delay-75"></div>
            </div>

            {/* Product Card - Shows on Hover */}
            {activeHotspot === hotspot.id && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 animate-in slide-in-from-bottom-4 duration-300 z-30">
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

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
            Discover Your
            <span className="block bg-gradient-to-r from-[#F1BA69] to-[#FFD700] bg-clip-text text-transparent">
              Perfect Space
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow opacity-90">
            Click on the hotspots to explore our premium furniture collection
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Shop All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
