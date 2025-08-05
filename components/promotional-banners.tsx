"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function PromotionalBanners() {
  const [isInView, setIsInView] = useState(false)
  const [hoveredBanner, setHoveredBanner] = useState<string | null>(null)
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
    <section ref={sectionRef} className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-[600px]">
            {/* Portrait Banner - 40% width (4 columns) */}
            <div className="lg:col-span-4">
              <Link
                href="/category/workstations"
                className="group relative block h-full"
                onMouseEnter={() => setHoveredBanner("workstations")}
                onMouseLeave={() => setHoveredBanner(null)}
              >
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
                      <div
                        className={`absolute transition-all duration-1000 ${
                          hoveredBanner === "workstations" ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {/* Left entering border */}
                        <div
                          className="absolute top-1/2 -left-16 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2"
                          style={{
                            width: hoveredBanner === "workstations" ? "80px" : "0px",
                            transition: "width 0.8s ease-out",
                          }}
                        ></div>
                        {/* Right exiting border */}
                        <div
                          className="absolute top-1/2 -right-16 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] transform -translate-y-1/2"
                          style={{
                            width: hoveredBanner === "workstations" ? "80px" : "0px",
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
                      <div
                        className={`transition-all duration-500 transform ${
                          hoveredBanner === "workstations" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                        }`}
                      >
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
              <Link
                href="/category/dining-tables"
                className="group relative block"
                onMouseEnter={() => setHoveredBanner("dining")}
                onMouseLeave={() => setHoveredBanner(null)}
              >
                <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src="/banners/dinner.jpeg"
                      alt="Luxury Dining Sets"
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-105 rounded-lg"
                    />
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-700"></div>
                  </div>

                  {/* Content - Vertically and Horizontally Centered */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 relative z-10">
                    <div className="text-center space-y-6">
                      {/* Square Background for Title */}
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-lg">
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          <span className="font-['Dancing_Script'] text-3xl md:text-4xl bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                            Luxury
                          </span>
                          <br />
                          DINING SETS
                        </h3>
                      </div>

                      <p className="text-white/80 text-lg">ELEGANT & COMFORTABLE</p>

                      {/* Percentage Badge with Border Integration */}
                      <div className="relative">
                        {/* Border that enters the percentage box */}
                        <div
                          className={`absolute transition-all duration-1000 ${
                            hoveredBanner === "dining" ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {/* Left entering border */}
                          <div
                            className="absolute top-1/2 -left-12 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "dining" ? "60px" : "0px",
                              transition: "width 0.8s ease-out",
                            }}
                          ></div>
                          {/* Right exiting border */}
                          <div
                            className="absolute top-1/2 -right-12 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "dining" ? "60px" : "0px",
                              transition: "width 0.8s ease-out 0.4s",
                            }}
                          ></div>
                        </div>

                        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-6 py-3 rounded-full relative z-10">
                          <span className="text-xl font-['Dancing_Script'] font-bold">55% OFF</span>
                        </div>
                      </div>

                      {/* CTA Button - Slides up from bottom on hover */}
                      <div className="relative overflow-hidden">
                        <div
                          className={`transition-all duration-500 transform ${
                            hoveredBanner === "dining" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                          }`}
                        >
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                            <span>Shop Now</span>
                            <ArrowRight className="h-4 w-4 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bottom Row - Two Banners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Office Chair Banner */}
                <Link
                  href="/category/office-chairs"
                  className="group relative block"
                  onMouseEnter={() => setHoveredBanner("office-chair")}
                  onMouseLeave={() => setHoveredBanner(null)}
                >
                  <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src="/banners/office-chair.jpeg"
                        alt="Premium Office Chairs"
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 rounded-lg"
                      />
                      {/* Background Overlay */}
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-700"></div>
                    </div>

                    {/* Content - Vertically and Horizontally Centered */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 relative z-10">
                      {/* Square Background for Title */}
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg mb-4">
                        <h3 className="text-xl font-bold text-white">
                          <span className="font-['Dancing_Script'] text-2xl bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                            Ergonomic
                          </span>
                          <br />
                          OFFICE CHAIRS
                        </h3>
                      </div>

                      {/* Percentage Badge with Border Integration */}
                      <div className="relative mb-4">
                        {/* Border that enters the percentage box */}
                        <div
                          className={`absolute transition-all duration-1000 ${
                            hoveredBanner === "office-chair" ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {/* Left entering border */}
                          <div
                            className="absolute top-1/2 -left-8 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "office-chair" ? "40px" : "0px",
                              transition: "width 0.8s ease-out",
                            }}
                          ></div>
                          {/* Right exiting border */}
                          <div
                            className="absolute top-1/2 -right-8 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "office-chair" ? "40px" : "0px",
                              transition: "width 0.8s ease-out 0.4s",
                            }}
                          ></div>
                        </div>

                        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-2 rounded-full relative z-10">
                          <span className="font-['Dancing_Script'] font-bold">25% OFF</span>
                        </div>
                      </div>

                      {/* CTA Button - Slides up from bottom on hover */}
                      <div className="relative overflow-hidden">
                        <div
                          className={`transition-all duration-500 transform ${
                            hoveredBanner === "office-chair"
                              ? "translate-y-0 opacity-100"
                              : "translate-y-full opacity-0"
                          }`}
                        >
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                            <span>Shop Now</span>
                            <ArrowRight className="h-4 w-4 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Sofa Banner */}
                <Link
                  href="/category/sofas"
                  className="group relative block"
                  onMouseEnter={() => setHoveredBanner("sofa")}
                  onMouseLeave={() => setHoveredBanner(null)}
                >
                  <div className="relative h-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-2xl rounded-lg">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src="/banners/sofa.jpeg"
                        alt="Luxury Sofas"
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 rounded-lg"
                      />
                      {/* Background Overlay */}
                      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-700"></div>
                    </div>

                    {/* Content - Vertically and Horizontally Centered */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 relative z-10">
                      {/* Square Background for Title */}
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 rounded-lg mb-4">
                        <h3 className="text-xl font-bold text-white">
                          <span className="font-['Dancing_Script'] text-2xl bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                            Premium
                          </span>
                          <br />
                          SOFAS
                        </h3>
                      </div>

                      {/* Percentage Badge with Border Integration */}
                      <div className="relative mb-4">
                        {/* Border that enters the percentage box */}
                        <div
                          className={`absolute transition-all duration-1000 ${
                            hoveredBanner === "sofa" ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {/* Left entering border */}
                          <div
                            className="absolute top-1/2 -left-8 h-0.5 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "sofa" ? "40px" : "0px",
                              transition: "width 0.8s ease-out",
                            }}
                          ></div>
                          {/* Right exiting border */}
                          <div
                            className="absolute top-1/2 -right-8 h-0.5 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] transform -translate-y-1/2"
                            style={{
                              width: hoveredBanner === "sofa" ? "40px" : "0px",
                              transition: "width 0.8s ease-out 0.4s",
                            }}
                          ></div>
                        </div>

                        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-2 rounded-full relative z-10">
                          <span className="font-['Dancing_Script'] font-bold">40% OFF</span>
                        </div>
                      </div>

                      {/* CTA Button - Slides up from bottom on hover */}
                      <div className="relative overflow-hidden">
                        <div
                          className={`transition-all duration-500 transform ${
                            hoveredBanner === "sofa" ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                          }`}
                        >
                          <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:border-transparent flex items-center space-x-2">
                            <span>Shop Now</span>
                            <ArrowRight className="h-4 w-4 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
