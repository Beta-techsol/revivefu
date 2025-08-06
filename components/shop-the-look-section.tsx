"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  productName: string
  price: string
  productUrl: string
}

const livingRoomHotspots: Hotspot[] = [
  {
    id: "chair",
    x: 25,
    y: 65,
    productName: "Modern Accent Chair",
    price: "$899",
    productUrl: "/product/modern-accent-chair"
  },
  {
    id: "sideboard",
    x: 65,
    y: 45,
    productName: "Wooden Sideboard",
    price: "$1,299",
    productUrl: "/product/wooden-sideboard"
  },
  {
    id: "lamp",
    x: 45,
    y: 25,
    productName: "Table Lamp",
    price: "$199",
    productUrl: "/product/table-lamp"
  }
]

const bedroomHotspots: Hotspot[] = [
  {
    id: "bed",
    x: 50,
    y: 70,
    productName: "Wooden Platform Bed",
    price: "$1,599",
    productUrl: "/product/wooden-platform-bed"
  },
  {
    id: "plant",
    x: 85,
    y: 55,
    productName: "Fiddle Leaf Fig Plant",
    price: "$89",
    productUrl: "/product/fiddle-leaf-fig"
  },
  {
    id: "nightstand",
    x: 15,
    y: 60,
    productName: "Wooden Nightstand",
    price: "$399",
    productUrl: "/product/wooden-nightstand"
  }
]

interface HotspotButtonProps {
  hotspot: Hotspot
  isActive: boolean
  onClick: () => void
}

function HotspotButton({ hotspot, isActive, onClick }: HotspotButtonProps) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={onClick}
    >
      {/* Hotspot Circle */}
      <div className="relative">
        <div className="w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-200 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        </div>
        
        {/* Pulsing Animation */}
        <div className="absolute inset-0 w-6 h-6 bg-white rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Product Info Tooltip */}
      {isActive && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 min-w-[200px] z-10 border">
          <div className="text-sm font-medium text-gray-900 mb-1">
            {hotspot.productName}
          </div>
          <div className="text-lg font-bold text-gray-900 mb-3">
            {hotspot.price}
          </div>
          <Button size="sm" className="w-full" asChild>
            <Link href={hotspot.productUrl}>
              View Product
            </Link>
          </Button>
          
          {/* Arrow pointing up */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t rotate-45"></div>
        </div>
      )}
    </div>
  )
}

export function ShopTheLookSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="px-[4%]">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 uppercase tracking-wide mb-4">
            SHOP THE LOOK
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore curated spaces styled to inspire. With Shop The Look, you can easily recreate your 
            favorite room setups with matching furniture and décor—effortless style, all in one place.
          </p>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Living Room Setup */}
          <div className="relative group">
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img17-nfOjWcqr16sWwxn9NDnG28Zo2SLw23.avif"
                alt="Living room furniture setup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Hotspots */}
              {livingRoomHotspots.map((hotspot) => (
                <HotspotButton
                  key={hotspot.id}
                  hotspot={hotspot}
                  isActive={activeHotspot === hotspot.id}
                  onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                />
              ))}
            </div>
          </div>

          {/* Bedroom Setup */}
          <div className="relative group">
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="/showcase/bed-room-setup.avif"
                alt="Bedroom furniture setup"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Hotspots */}
              {bedroomHotspots.map((hotspot) => (
                <HotspotButton
                  key={hotspot.id}
                  hotspot={hotspot}
                  isActive={activeHotspot === hotspot.id}
                  onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="px-8 py-3" asChild>
            <Link href="/shop">
              Explore All Collections
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
