"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function FurnitureShowcaseSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
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

  const showcaseItems = [
    {
      id: "living-room",
      title: "Modern Living Spaces",
      subtitle: "Contemporary Comfort",
      description:
        "Discover our curated collection of modern living room furniture that combines style with functionality",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cf991c42-226c-41d3-b3ec-e2ed620dc05d-Vw9y5zyhjjAWr6cu897P1FntpS9UWk.png",
      link: "/category/living-room",
      category: "Living Room",
    },
    {
      id: "bedroom",
      title: "Luxury Bedrooms",
      subtitle: "Rest in Style",
      description: "Transform your bedroom into a sanctuary with our premium bedroom furniture collection",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bed-GZ6QfxIFAsu6fbhyfRkYzcFTQBdmK6.avif",
      link: "/category/bedroom",
      category: "Bedroom",
    },
    {
      id: "office",
      title: "Workspace Solutions",
      subtitle: "Productive Environments",
      description: "Create the perfect workspace with our ergonomic and stylish office furniture",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/office-decor-ideas.jpg-pvlyfz8H489o4B3bJcOWhAZov81pk4.jpeg",
      link: "/category/office",
      category: "Office",
    },
    {
      id: "decor",
      title: "Home Accessories",
      subtitle: "Finishing Touches",
      description: "Complete your space with our carefully selected home decor and accessories",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home2-banner-4-gT1gynGxSHr9ZRg5boNd34COQTNs0D.avif",
      link: "/category/decor",
      category: "Decor",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
      style={{
        height: "100vh",
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "3%",
        paddingBottom: "3%",
      }}
    >
      <div className="h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          {/* Left Portrait Image - Takes 5 columns */}
          <div className="lg:col-span-5 h-full">
            <Link
              href={showcaseItems[0].link}
              className="group relative block h-full"
              onMouseEnter={() => setHoveredItem(showcaseItems[0].id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative h-full overflow-hidden rounded-2xl bg-gray-100">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={showcaseItems[0].image || "/placeholder.svg"}
                    alt={showcaseItems[0].title}
                    fill
                    className={`object-cover transition-all duration-700 ${
                      hoveredItem === showcaseItems[0].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                    }`}
                  />
                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${
                      hoveredItem === showcaseItems[0].id ? "bg-black/60" : "bg-black/20"
                    }`}
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  {/* Category Badge */}
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 transition-all duration-500 transform ${
                      hoveredItem === showcaseItems[0].id
                        ? "bg-white text-black translate-y-0 opacity-100"
                        : "bg-white/20 text-white translate-y-4 opacity-0"
                    }`}
                  >
                    {showcaseItems[0].category}
                  </div>

                  {/* Title */}
                  <h2
                    className={`text-4xl lg:text-5xl font-bold text-white mb-3 transition-all duration-500 transform ${
                      hoveredItem === showcaseItems[0].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                    }`}
                  >
                    {showcaseItems[0].title}
                  </h2>

                  {/* Subtitle */}
                  <p
                    className={`text-xl text-white/90 mb-4 transition-all duration-500 transform ${
                      hoveredItem === showcaseItems[0].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-60"
                    }`}
                  >
                    {showcaseItems[0].subtitle}
                  </p>

                  {/* Description - Only visible on hover */}
                  <p
                    className={`text-white/80 text-lg mb-6 transition-all duration-500 transform ${
                      hoveredItem === showcaseItems[0].id
                        ? "translate-y-0 opacity-100 max-h-20"
                        : "translate-y-8 opacity-0 max-h-0"
                    }`}
                  >
                    {showcaseItems[0].description}
                  </p>

                  {/* Arrow - Bottom Right */}
                  <div className="absolute bottom-8 right-8">
                    <div
                      className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                        hoveredItem === showcaseItems[0].id
                          ? "bg-white text-black scale-110 rotate-45"
                          : "bg-transparent text-white scale-100 rotate-0"
                      }`}
                    >
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column - Takes 7 columns */}
          <div className="lg:col-span-7 h-full">
            <div className="grid grid-rows-2 gap-4 h-full">
              {/* Top Landscape Image */}
              <div className="row-span-1">
                <Link
                  href={showcaseItems[1].link}
                  className="group relative block h-full"
                  onMouseEnter={() => setHoveredItem(showcaseItems[1].id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-gray-100">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={showcaseItems[1].image || "/placeholder.svg"}
                        alt={showcaseItems[1].title}
                        fill
                        className={`object-cover transition-all duration-700 ${
                          hoveredItem === showcaseItems[1].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                        }`}
                      />
                      {/* Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-500 ${
                          hoveredItem === showcaseItems[1].id ? "bg-black/60" : "bg-black/20"
                        }`}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                      {/* Category Badge */}
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[1].id
                            ? "bg-white text-black translate-y-0 opacity-100"
                            : "bg-white/20 text-white translate-y-4 opacity-0"
                        }`}
                      >
                        {showcaseItems[1].category}
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-2xl lg:text-3xl font-bold text-white mb-2 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[1].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                        }`}
                      >
                        {showcaseItems[1].title}
                      </h3>

                      {/* Subtitle */}
                      <p
                        className={`text-lg text-white/90 mb-3 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[1].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-60"
                        }`}
                      >
                        {showcaseItems[1].subtitle}
                      </p>

                      {/* Description - Only visible on hover */}
                      <p
                        className={`text-white/80 mb-4 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[1].id
                            ? "translate-y-0 opacity-100 max-h-16"
                            : "translate-y-8 opacity-0 max-h-0"
                        }`}
                      >
                        {showcaseItems[1].description}
                      </p>

                      {/* Arrow - Bottom Right */}
                      <div className="absolute bottom-6 right-6">
                        <div
                          className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                            hoveredItem === showcaseItems[1].id
                              ? "bg-white text-black scale-110 rotate-45"
                              : "bg-transparent text-white scale-100 rotate-0"
                          }`}
                        >
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bottom Row - Two Square Images */}
              <div className="row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bottom Left Square */}
                <Link
                  href={showcaseItems[2].link}
                  className="group relative block h-full"
                  onMouseEnter={() => setHoveredItem(showcaseItems[2].id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-gray-100">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={showcaseItems[2].image || "/placeholder.svg"}
                        alt={showcaseItems[2].title}
                        fill
                        className={`object-cover transition-all duration-700 ${
                          hoveredItem === showcaseItems[2].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                        }`}
                      />
                      {/* Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-500 ${
                          hoveredItem === showcaseItems[2].id ? "bg-black/60" : "bg-black/20"
                        }`}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                      {/* Category Badge */}
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[2].id
                            ? "bg-white text-black translate-y-0 opacity-100"
                            : "bg-white/20 text-white translate-y-4 opacity-0"
                        }`}
                      >
                        {showcaseItems[2].category}
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xl font-bold text-white mb-1 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[2].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                        }`}
                      >
                        {showcaseItems[2].title}
                      </h4>

                      {/* Subtitle */}
                      <p
                        className={`text-sm text-white/90 mb-2 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[2].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-60"
                        }`}
                      >
                        {showcaseItems[2].subtitle}
                      </p>

                      {/* Description - Only visible on hover */}
                      <p
                        className={`text-white/80 text-sm mb-3 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[2].id
                            ? "translate-y-0 opacity-100 max-h-12"
                            : "translate-y-8 opacity-0 max-h-0"
                        }`}
                      >
                        {showcaseItems[2].description}
                      </p>

                      {/* Arrow - Bottom Right */}
                      <div className="absolute bottom-5 right-5">
                        <div
                          className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                            hoveredItem === showcaseItems[2].id
                              ? "bg-white text-black scale-110 rotate-45"
                              : "bg-transparent text-white scale-100 rotate-0"
                          }`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Bottom Right Square */}
                <Link
                  href={showcaseItems[3].link}
                  className="group relative block h-full"
                  onMouseEnter={() => setHoveredItem(showcaseItems[3].id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-gray-100">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={showcaseItems[3].image || "/placeholder.svg"}
                        alt={showcaseItems[3].title}
                        fill
                        className={`object-cover transition-all duration-700 ${
                          hoveredItem === showcaseItems[3].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                        }`}
                      />
                      {/* Overlay */}
                      <div
                        className={`absolute inset-0 transition-all duration-500 ${
                          hoveredItem === showcaseItems[3].id ? "bg-black/60" : "bg-black/20"
                        }`}
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 z-10">
                      {/* Category Badge */}
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-2 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[3].id
                            ? "bg-white text-black translate-y-0 opacity-100"
                            : "bg-white/20 text-white translate-y-4 opacity-0"
                        }`}
                      >
                        {showcaseItems[3].category}
                      </div>

                      {/* Title */}
                      <h4
                        className={`text-xl font-bold text-white mb-1 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[3].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-80"
                        }`}
                      >
                        {showcaseItems[3].title}
                      </h4>

                      {/* Subtitle */}
                      <p
                        className={`text-sm text-white/90 mb-2 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[3].id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-60"
                        }`}
                      >
                        {showcaseItems[3].subtitle}
                      </p>

                      {/* Description - Only visible on hover */}
                      <p
                        className={`text-white/80 text-sm mb-3 transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[3].id
                            ? "translate-y-0 opacity-100 max-h-12"
                            : "translate-y-8 opacity-0 max-h-0"
                        }`}
                      >
                        {showcaseItems[3].description}
                      </p>

                      {/* Arrow - Bottom Right */}
                      <div className="absolute bottom-5 right-5">
                        <div
                          className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                            hoveredItem === showcaseItems[3].id
                              ? "bg-white text-black scale-110 rotate-45"
                              : "bg-transparent text-white scale-100 rotate-0"
                          }`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
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
