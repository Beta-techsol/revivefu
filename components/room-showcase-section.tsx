"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const rooms = [
  {
    id: "office",
    title: "Office",
    description: "Professional workspace solutions",
    image: "/backgrounds/office-room.jpg",
    products: ["Desks", "Chairs", "Storage", "Lighting"],
  },
  {
    id: "bedroom",
    title: "Bedroom",
    description: "Comfortable and stylish rest spaces",
    image: "/backgrounds/bg1-2.jpg",
    products: ["Beds", "Wardrobes", "Nightstands", "Dressers"],
  },
  {
    id: "living",
    title: "Living Room",
    description: "Elegant spaces for relaxation",
    image: "/backgrounds/bg3-1.jpg",
    products: ["Sofas", "Coffee Tables", "TV Units", "Decor"],
  },
  {
    id: "reading",
    title: "Reading Corner",
    description: "Cozy spaces for quiet moments",
    image: "/backgrounds/reading.jpg",
    products: ["Armchairs", "Bookshelves", "Side Tables", "Lamps"],
  },
]

export function RoomShowcaseSection() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null)

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="px-[5%]">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Shop by Room</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover furniture collections tailored for every space in your home
          </p>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={room.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4 opacity-90">{room.description}</p>

                  {/* Product Tags */}
                  <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {room.products.slice(0, 2).map((product) => (
                      <span
                        key={product}
                        className="text-xs bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white"
                      >
                        {product}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="sm"
                    className="w-fit bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full px-6 py-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 delay-200 transform translate-y-4 group-hover:translate-y-0"
                  >
                    Explore {room.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/50 rounded-2xl transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-all duration-300 bg-transparent"
          >
            View All Rooms
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
