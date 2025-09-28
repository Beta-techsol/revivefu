"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ShoppingCart, Eye } from "lucide-react"

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
    category: string
  }
}

const hotspots: Hotspot[] = [
  {
    id: "pendant-lights",
    x: 15,
    y: 25,
    product: {
      name: "Modern Pendant Lights",
      price: 89999,
      originalPrice: 119999,
      image: "/placeholder.svg?height=200&width=200",
      description: "Elegant wooden pendant lights with warm LED illumination",
      category: "Lighting",
    },
  },
  {
    id: "plant-left",
    x: 8,
    y: 65,
    product: {
      name: "Ceramic Plant Pot",
      price: 26999,
      image: "/placeholder.svg?height=200&width=200",
      description: "Modern white ceramic planter with drainage system",
      category: "Decor",
    },
  },
  {
    id: "tv-cabinet",
    x: 50,
    y: 75,
    product: {
      name: "Wooden TV Console",
      price: 269999,
      originalPrice: 359999,
      image: "/placeholder.svg?height=200&width=200",
      description: "Scandinavian-style oak TV cabinet with sliding doors",
      category: "Storage",
    },
  },
  {
    id: "armchair",
    x: 80,
    y: 60,
    product: {
      name: "Cozy Armchair",
      price: 194999,
      originalPrice: 239999,
      image: "/placeholder.svg?height=200&width=200",
      description: "Comfortable upholstered armchair with wooden legs",
      category: "Seating",
    },
  },
  {
    id: "plant-right",
    x: 92,
    y: 45,
    product: {
      name: "Large Floor Plant",
      price: 38999,
      image: "/placeholder.svg?height=200&width=200",
      description: "Beautiful large indoor plant in modern planter",
      category: "Decor",
    },
  },
]

export function InteractiveHotspotBanner() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)

  const handleHotspotClick = (hotspotId: string) => {
    setActiveHotspot(activeHotspot === hotspotId ? null : hotspotId)
  }

  const closeModal = () => {
    setActiveHotspot(null)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const activeProduct = hotspots.find((h) => h.id === activeHotspot)?.product

  return (
    <section className="relative w-full h-[550px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/design-mode/cool.avif"
          alt="Modern living room showcase"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
        {/* Main Heading */}
        <div className="mb-8 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-normal tracking-wider mb-4 font-['Poppins'] outline-text">
            SHOP THE LOOK
          </h1>
          <h2
            className="text-white leading-relaxed max-w-3xl mx-auto font-['Poppins'] font-normal"
            style={{ fontSize: "15px" }}
          >
            STEP INTO OUR LATEST LOOKBOOK AND EXPLORE A BEAUTIFULLY STYLED
            <br />
            LIVING ROOM FEATURING A COZY ARMCHAIR AND SLEEK TV CABINET
          </h2>
        </div>

        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute cursor-pointer group"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => handleHotspotClick(hotspot.id)}
          >
            {/* Hotspot Dot */}
            <div
              className={`
              w-6 h-6 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm
              transition-all duration-300 hover:scale-125 hover:bg-white/40
              ${hoveredHotspot === hotspot.id ? "animate-pulse scale-125" : ""}
              ${activeHotspot === hotspot.id ? "bg-white scale-125" : ""}
            `}
            >
              <div className="w-full h-full rounded-full bg-white/60" />
            </div>

            {/* Ripple Effect */}
            <div
              className={`
              absolute inset-0 rounded-full border-2 border-white/50
              animate-ping
              ${hoveredHotspot === hotspot.id ? "opacity-100" : "opacity-0"}
            `}
            />

            {/* Hover Tooltip */}
            {hoveredHotspot === hotspot.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 animate-fade-in-up">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-white/20">
                  <p className="text-sm font-medium text-gray-800 whitespace-nowrap font-['Poppins']">
                    {hotspot.product.name}
                  </p>
                  <p className="text-xs text-gray-600 font-['Poppins']">{formatPrice(hotspot.product.price)}</p>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {activeProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* Product Image */}
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
              <Image
                src={activeProduct.image || "/placeholder.svg"}
                alt={activeProduct.name}
                fill
                className="object-cover"
              />
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 font-['Poppins']">
                  {activeProduct.category}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-2 font-['Poppins']">{activeProduct.name}</h3>
              <p
                className="text-gray-600 mb-4 leading-relaxed font-['Poppins'] font-normal"
                style={{ fontSize: "15px" }}
              >
                {activeProduct.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-medium text-gray-900 font-['Poppins']">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.originalPrice && (
                  <span className="text-lg text-gray-500 line-through font-['Poppins']">
                    {formatPrice(activeProduct.originalPrice)}
                  </span>
                )}
                {activeProduct.originalPrice && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium font-['Poppins']">
                    Save {formatPrice(activeProduct.originalPrice - activeProduct.price)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 font-['Poppins']">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .outline-text {
          -webkit-text-stroke: 3px rgba(255, 255, 255, 0.4);
          color: transparent;
          text-shadow: 0 0 0 rgba(255, 255, 255, 0.8);
          background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
          -webkit-background-clip: text;
          background-clip: text;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
