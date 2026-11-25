"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface ShowcaseItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  link: string
}

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

  const showcaseItems: ShowcaseItem[] = [
    {
      id: "living-room",
      title: "Modern Living Spaces",
      subtitle: "Contemporary Comfort",
      description:
        "Discover our curated collection of modern living room furniture that combines style with functionality",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home2-banner-4-TDMPOmf1D4Eam8JU1uWujLuodRx1Z7.avif",
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
      id: "executive-office",
      title: "Executive Office Solutions",
      subtitle: "Professional Excellence",
      description: "Elevate your workspace with our premium executive office furniture and modern desk solutions",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20250804_1720_Modern%20Office%20Desk_remix_01k1tg8pg6eya8wzq7djwx17eg-UF259OJSDTKcvFgrgz1ELsRIXqjIgl.png",
      link: "/category/executive-office",
      category: "Executive Office",
    },
  ]

  return (
    <>
      {/* Add Dancing Script font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        .dancing-script {
          font-family: 'Dancing Script', cursive;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-swing {
          animation: swing 4s ease-in-out infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(1deg); }
          66% { transform: translateY(-5px) rotate(-1deg); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-white w-full"
        style={{
          minHeight: "750px",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingTop: "5%",
          paddingBottom: "1%",
          marginBottom: "10px",
        }}
      >
        <div className="h-full w-full" style={{ minHeight: "700px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
            {/* Left Portrait Image - Takes 5 columns - Fixed 700px height */}
            <div className="lg:col-span-5" style={{ height: "700px" }}>
              <Link
                href={showcaseItems[0].link}
                className="group relative block w-full"
                style={{ height: "700px" }}
                onMouseEnter={() => setHoveredItem(showcaseItems[0].id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100" style={{ height: "700px" }}>
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={showcaseItems[0].image || "/placeholder.svg"}
                      alt={showcaseItems[0].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className={`object-cover transition-all duration-700 ${
                        hoveredItem === showcaseItems[0].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                      }`}
                      priority
                    />
                    {/* Overlay - Only visible on hover */}
                    <div
                      className={`absolute inset-0 transition-all duration-500 ${
                        hoveredItem === showcaseItems[0].id ? "bg-black/60" : "bg-transparent"
                      }`}
                    />
                  </div>

                  {/* Content Overlay - Only visible on hover */}
                  <div className="absolute inset-0 flex flex-col justify-center items-start p-8 z-10">
                    {/* Subtitle with Dancing Script and random animation */}
                    <p
                      className={`dancing-script text-3xl text-white mb-3 transition-all duration-700 transform animate-float ${
                        hoveredItem === showcaseItems[0].id ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                      }`}
                      style={{ transitionDelay: "0.1s" }}
                    >
                      {showcaseItems[0].subtitle}
                    </p>

                    {/* Title */}
                    <h2
                      className={`text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-700 transform ${
                        hoveredItem === showcaseItems[0].id ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                      }`}
                      style={{ transitionDelay: "0.2s" }}
                    >
                      {showcaseItems[0].title}
                    </h2>

                    {/* Description */}
                    <p
                      className={`text-white/90 text-lg mb-6 max-w-md transition-all duration-700 transform ${
                        hoveredItem === showcaseItems[0].id ? "translate-x-0 opacity-100" : "-translate-x-16 opacity-0"
                      }`}
                      style={{ transitionDelay: "0.3s" }}
                    >
                      {showcaseItems[0].description}
                    </p>

                    {/* Arrow - Bottom Right */}
                    <div className="absolute bottom-8 right-8">
                      <div
                        className={`w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                          hoveredItem === showcaseItems[0].id
                            ? "bg-white text-black scale-110 rotate-45 opacity-100"
                            : "bg-transparent text-white scale-100 rotate-0 opacity-0"
                        }`}
                      >
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column - Takes 7 columns - Matching 700px height */}
            <div className="lg:col-span-7" style={{ height: "700px" }}>
              <div className="grid grid-rows-2 gap-4 h-full">
                {/* Top Landscape Image - Takes half of 700px minus gap */}
                <div className="row-span-1" style={{ height: "calc(350px - 8px)" }}>
                  <Link
                    href={showcaseItems[1].link}
                    className="group relative block h-full w-full"
                    onMouseEnter={() => setHoveredItem(showcaseItems[1].id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={showcaseItems[1].image || "/placeholder.svg"}
                          alt={showcaseItems[1].title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className={`object-cover transition-all duration-700 ${
                            hoveredItem === showcaseItems[1].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                          }`}
                        />
                        {/* Overlay - Only visible on hover */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${
                            hoveredItem === showcaseItems[1].id ? "bg-black/60" : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content Overlay - Only visible on hover */}
                      <div className="absolute inset-0 flex flex-col justify-center items-start p-6 z-10">
                        {/* Subtitle with Dancing Script and random animation */}
                        <p
                          className={`dancing-script text-2xl text-white mb-2 transition-all duration-700 transform animate-pulse-slow ${
                            hoveredItem === showcaseItems[1].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-8 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.1s" }}
                        >
                          {showcaseItems[1].subtitle}
                        </p>

                        {/* Title */}
                        <h3
                          className={`text-2xl lg:text-3xl font-bold text-white mb-3 transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[1].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-12 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.2s" }}
                        >
                          {showcaseItems[1].title}
                        </h3>

                        {/* Description */}
                        <p
                          className={`text-white/90 mb-4 max-w-sm transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[1].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-16 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.3s" }}
                        >
                          {showcaseItems[1].description}
                        </p>

                        {/* Arrow - Bottom Right */}
                        <div className="absolute bottom-6 right-6">
                          <div
                            className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                              hoveredItem === showcaseItems[1].id
                                ? "bg-white text-black scale-110 rotate-45 opacity-100"
                                : "bg-transparent text-white scale-100 rotate-0 opacity-0"
                            }`}
                          >
                            <ArrowUpRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Bottom Row - Two Square Images - Takes remaining half of 700px minus gap */}
                <div
                  className="row-span-1 grid grid-cols-1 md:grid-cols-2 gap-4"
                  style={{ height: "calc(350px - 8px)" }}
                >
                  {/* Bottom Left Square */}
                  <Link
                    href={showcaseItems[2].link}
                    className="group relative block h-full w-full"
                    onMouseEnter={() => setHoveredItem(showcaseItems[2].id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={showcaseItems[2].image || "/placeholder.svg"}
                          alt={showcaseItems[2].title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 29vw"
                          className={`object-cover transition-all duration-700 ${
                            hoveredItem === showcaseItems[2].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                          }`}
                        />
                        {/* Overlay - Only visible on hover */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${
                            hoveredItem === showcaseItems[2].id ? "bg-black/60" : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content Overlay - Only visible on hover */}
                      <div className="absolute inset-0 flex flex-col justify-center items-start p-5 z-10">
                        {/* Subtitle with Dancing Script and random animation */}
                        <p
                          className={`dancing-script text-xl text-white mb-2 transition-all duration-700 transform animate-swing ${
                            hoveredItem === showcaseItems[2].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-8 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.1s" }}
                        >
                          {showcaseItems[2].subtitle}
                        </p>

                        {/* Title */}
                        <h4
                          className={`text-xl font-bold text-white mb-2 transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[2].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-12 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.2s" }}
                        >
                          {showcaseItems[2].title}
                        </h4>

                        {/* Description */}
                        <p
                          className={`text-white/90 text-sm mb-3 max-w-xs transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[2].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-16 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.3s" }}
                        >
                          {showcaseItems[2].description}
                        </p>

                        {/* Arrow - Bottom Right */}
                        <div className="absolute bottom-5 right-5">
                          <div
                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                              hoveredItem === showcaseItems[2].id
                                ? "bg-white text-black scale-110 rotate-45 opacity-100"
                                : "bg-transparent text-white scale-100 rotate-0 opacity-0"
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
                    className="group relative block h-full w-full"
                    onMouseEnter={() => setHoveredItem(showcaseItems[3].id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={showcaseItems[3].image || "/placeholder.svg"}
                          alt={showcaseItems[3].title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 29vw"
                          className={`object-cover transition-all duration-700 ${
                            hoveredItem === showcaseItems[3].id ? "scale-110 blur-sm" : "scale-100 blur-0"
                          }`}
                        />
                        {/* Overlay - Only visible on hover */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ${
                            hoveredItem === showcaseItems[3].id ? "bg-black/60" : "bg-transparent"
                          }`}
                        />
                      </div>

                      {/* Content Overlay - Only visible on hover */}
                      <div className="absolute inset-0 flex flex-col justify-center items-start p-5 z-10">
                        {/* Subtitle with Dancing Script and random animation */}
                        <p
                          className={`dancing-script text-xl text-white mb-2 transition-all duration-700 transform animate-bounce-slow ${
                            hoveredItem === showcaseItems[3].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-8 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.1s" }}
                        >
                          {showcaseItems[3].subtitle}
                        </p>

                        {/* Title */}
                        <h4
                          className={`text-xl font-bold text-white mb-2 transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[3].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-12 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.2s" }}
                        >
                          {showcaseItems[3].title}
                        </h4>

                        {/* Description */}
                        <p
                          className={`text-white/90 text-sm mb-3 max-w-xs transition-all duration-700 transform ${
                            hoveredItem === showcaseItems[3].id
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-16 opacity-0"
                          }`}
                          style={{ transitionDelay: "0.3s" }}
                        >
                          {showcaseItems[3].description}
                        </p>

                        {/* Arrow - Bottom Right */}
                        <div className="absolute bottom-5 right-5">
                          <div
                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all duration-500 transform ${
                              hoveredItem === showcaseItems[3].id
                                ? "bg-white text-black scale-110 rotate-45 opacity-100"
                                : "bg-transparent text-white scale-100 rotate-0 opacity-0"
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
    </>
  )
}
