"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

const bannerData = [
  {
    id: 1,
    title: "COMFORT MEETS STYLE",
    subtitle: "COZY FABRIC SOFA",
    description: "Create a peaceful and stylish retreat with a Scandinavian Bedroom.",
    image: "/banners/center-table-new.jpeg",
    link: "/shop?category=living-room",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "MODERN DINING",
    subtitle: "ELEGANT DINING SETS",
    description: "Transform your dining space with contemporary furniture.",
    image: "/banners/dining-new.jpeg",
    link: "/shop?category=dining-room",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "PEACEFUL RETREAT",
    subtitle: "BEDROOM COLLECTION",
    description: "Design your perfect sanctuary with our bedroom furniture.",
    image: "/banners/bedroom-new.avif",
    link: "/shop?category=bedroom",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "HOME DECOR",
    subtitle: "STYLISH ACCESSORIES",
    description: "Complete your space with beautiful decorative pieces.",
    image: "/banners/home-decor.avif",
    link: "/shop?category=decor",
    className: "md:col-span-1 md:row-span-1",
  },
]

export function PromotionalBanners() {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden px-[5%] py-[3%]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[600px] md:h-[700px]">
            {/* Portrait Banner - 40% width (4 columns) */}
            <div className="lg:col-span-4">
              <Link href="/category/workstations" className="group relative block h-full">
                <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/banners/workstations.jpeg"
                      alt="Modern Workstations"
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105 rounded-lg"
                    />
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-700"></div>
                  </div>

                  {/* Content - Vertically and Horizontally Centered */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 relative z-10">
                    {/* Square Background for Title */}
                    <div className="relative mb-6">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-lg">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                          <span className="block">MODERN</span>
                          <span className="block font-['Dancing_Script'] text-4xl lg:text-5xl bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                            Workstations
                          </span>
                        </h2>
                      </div>
                    </div>

                    <p className="text-white/80 text-lg font-medium mb-8">PRODUCTIVITY MEETS STYLE</p>

                    {/* Percentage Badge with Border Integration */}
                    <div className="relative mb-8">
                      {/* Border that enters the percentage box */}
                      <div className="absolute transition-all duration-1000 opacity-100">
                        {/* Left entering border */}
                        <div
                          className="absolute top-1/2 -left-16 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2"
                          style={{
                            width: "80px",
                            transition: "width 0.8s ease-out",
                          }}
                        ></div>
                        {/* Right exiting border */}
                        <div
                          className="absolute top-1/2 -right-16 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] transform -translate-y-1/2"
                          style={{
                            width: "80px",
                            transition: "width 0.8s ease-out 0.4s",
                          }}
                        ></div>
                      </div>

                      <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-8 py-4 rounded-full relative z-10">
                        <span className="text-3xl font-['Dancing_Script'] font-bold">30%</span>
                        <span className="text-lg ml-2 font-['Dancing_Script']">OFF</span>
                      </div>
                    </div>

                    {/* CTA Button - Slides up from bottom on hover */}
                    <div className="relative overflow-hidden">
                      <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                          <span>Shop Now</span>
                          <ArrowRight className="h-4 w-4 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column - 60% width (6 columns) */}
            <div className="lg:col-span-6 grid grid-rows-2 gap-6">
              {/* Top Banner */}
              <Link href="/category/dining-tables" className="group relative block">
                <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/banners/dinner.jpeg"
                      alt="Luxury Dining Sets"
                      fill
                      className="object-cover transition-all duration-700 ease-out group-hover:blur-sm group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8 text-white">
                    {/* Main Content */}
                    <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                      <p className="text-sm font-medium tracking-wider opacity-90 mb-2">LUXURY DINING</p>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">ELEGANT DINING SETS</h3>
                      <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-xs leading-relaxed">
                        Transform your dining space with contemporary furniture.
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-8 right-8">
                      <div className="relative">
                        {/* Stroke/Border */}
                        <div className="absolute inset-0 w-12 h-12 border-2 border-white/30 rounded-full transform rotate-45"></div>
                        {/* Arrow Container */}
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                          <ArrowUpRight className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>
              </Link>

              {/* Bottom Row - Two Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Office Chair Banner */}
                <Link href="/category/office-chairs" className="group relative block">
                  <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src="/banners/office-chair.jpeg"
                        alt="Premium Office Chairs"
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:blur-sm group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                      {/* Main Content */}
                      <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                        <p className="text-sm font-medium tracking-wider opacity-90 mb-2">
                          COMFORT MEETS FUNCTIONALITY
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">ECONOMICAL OFFICE CHAIRS</h3>
                        <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-xs leading-relaxed">
                          Find the perfect chair for your workspace.
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute bottom-8 right-8">
                        <div className="relative">
                          {/* Stroke/Border */}
                          <div className="absolute inset-0 w-12 h-12 border-2 border-white/30 rounded-full transform rotate-45"></div>
                          {/* Arrow Container */}
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <ArrowUpRight className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>
                </Link>

                {/* Sofa Banner */}
                <Link href="/category/sofas" className="group relative block">
                  <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src="/banners/sofa.jpeg"
                        alt="Luxury Sofas"
                        fill
                        className="object-cover transition-all duration-700 ease-out group-hover:blur-sm group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-8 text-white">
                      {/* Main Content */}
                      <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                        <p className="text-sm font-medium tracking-wider opacity-90 mb-2">PEACEFUL RETREAT</p>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">BEDROOM COLLECTION</h3>
                        <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-xs leading-relaxed">
                          Design your perfect sanctuary with our bedroom furniture.
                        </p>
                      </div>

                      {/* Arrow Icon */}
                      <div className="absolute bottom-8 right-8">
                        <div className="relative">
                          {/* Stroke/Border */}
                          <div className="absolute inset-0 w-12 h-12 border-2 border-white/30 rounded-full transform rotate-45"></div>
                          {/* Arrow Container */}
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                            <ArrowUpRight className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* New Banners */}
            {bannerData.map((banner) => (
              <Link
                key={banner.id}
                href={banner.link}
                className={`group relative overflow-hidden rounded-2xl ${banner.className} cursor-pointer`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={banner.image || "/placeholder.svg"}
                    alt={banner.subtitle}
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:blur-sm group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  {/* Main Content */}
                  <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                    <p className="text-sm font-medium tracking-wider opacity-90 mb-2">{banner.title}</p>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{banner.subtitle}</h3>
                    <p className="text-sm md:text-base opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-xs leading-relaxed">
                      {banner.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute bottom-8 right-8">
                    <div className="relative">
                      {/* Stroke/Border */}
                      <div className="absolute inset-0 w-12 h-12 border-2 border-white/30 rounded-full transform rotate-45"></div>
                      {/* Arrow Container */}
                      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                        <ArrowUpRight className="w-5 h-5 text-white transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
