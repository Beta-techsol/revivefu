"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface RoomBanner {
  id: string
  title: string
  subtitle: string
  price: string
  image: string
  link: string
  overlayPosition: "left" | "right"
}

const roomBanners: RoomBanner[] = [
  {
    id: "office",
    title: "IN THE",
    subtitle: "OFFICE ROOM",
    price: "45$",
    image: "/banners/office-room-banner.jpeg",
    link: "/shop?category=office",
    overlayPosition: "left",
  },
  {
    id: "living",
    title: "IN THE",
    subtitle: "LIVING ROOM",
    price: "55$",
    image: "/banners/living-room-banner.jpeg",
    link: "/shop?category=living-room",
    overlayPosition: "right",
  },
  {
    id: "reading",
    title: "IN THE",
    subtitle: "READING ROOM",
    price: "25$",
    image: "/banners/reading-room-banner.jpeg",
    link: "/shop?category=study",
    overlayPosition: "left",
  },
  {
    id: "bedroom",
    title: "WE ARE SOFANI",
    subtitle: "BED ROOM",
    price: "35$",
    image: "/banners/bedroom-banner.jpeg",
    link: "/shop?category=bedroom",
    overlayPosition: "right",
  },
]

export function RoomBannersSection() {
  const [hoveredBanner, setHoveredBanner] = useState<string | null>(null)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Grid Layout - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {roomBanners.map((banner) => (
            <Link key={banner.id} href={banner.link}>
              <div
                className="group relative h-80 lg:h-96 overflow-hidden rounded-lg cursor-pointer"
                onMouseEnter={() => setHoveredBanner(banner.id)}
                onMouseLeave={() => setHoveredBanner(null)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={`${banner.subtitle} furniture`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Overlay - Half Coverage */}
                <div
                  className={`absolute inset-0 bg-black/60 transition-all duration-500 ${
                    banner.overlayPosition === "left"
                      ? "bg-gradient-to-r from-black/70 via-black/40 to-transparent"
                      : "bg-gradient-to-l from-black/70 via-black/40 to-transparent"
                  }`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-between p-8">
                  {banner.overlayPosition === "left" ? (
                    <>
                      {/* Left Side - Text */}
                      <div className="text-white z-10">
                        <div className="text-sm font-medium tracking-wider mb-2 opacity-90">{banner.title}</div>
                        <div className="text-3xl lg:text-4xl font-bold leading-tight">
                          {banner.subtitle === "BED ROOM" ? (
                            <>
                              <span className="block">BED</span>
                              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ROOM
                              </span>
                            </>
                          ) : (
                            banner.subtitle
                          )}
                        </div>

                        {/* Hover Title */}
                        <div
                          className={`mt-4 text-lg font-medium transition-all duration-300 ${
                            hoveredBanner === banner.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                        >
                          {banner.id === "office" && "Professional Workspace Solutions"}
                          {banner.id === "living" && "Comfort Meets Style"}
                          {banner.id === "reading" && "Peaceful Study Sanctuary"}
                          {banner.id === "bedroom" && "Dream Sleep Collection"}
                        </div>
                      </div>

                      {/* Right Side - Price Circle */}
                      <div className="relative z-10">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                          <span className="text-2xl lg:text-3xl font-bold text-black">{banner.price}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left Side - Price Circle */}
                      <div className="relative z-10">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12">
                          <span className="text-2xl lg:text-3xl font-bold text-black">{banner.price}</span>
                        </div>
                      </div>

                      {/* Right Side - Text */}
                      <div className="text-white z-10 text-right">
                        <div className="text-sm font-medium tracking-wider mb-2 opacity-90">{banner.title}</div>
                        <div className="text-3xl lg:text-4xl font-bold leading-tight">
                          {banner.subtitle === "BED ROOM" ? (
                            <>
                              <span className="block">BED</span>
                              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ROOM
                              </span>
                            </>
                          ) : (
                            banner.subtitle
                          )}
                        </div>

                        {/* Hover Title */}
                        <div
                          className={`mt-4 text-lg font-medium transition-all duration-300 ${
                            hoveredBanner === banner.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          }`}
                        >
                          {banner.id === "office" && "Professional Workspace Solutions"}
                          {banner.id === "living" && "Comfort Meets Style"}
                          {banner.id === "reading" && "Peaceful Study Sanctuary"}
                          {banner.id === "bedroom" && "Dream Sleep Collection"}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Hover Overlay Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
                    hoveredBanner === banner.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
