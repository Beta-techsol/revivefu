"use client"

import { useState } from "react"
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
  animationClass: string
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "living-room",
    title: "Modern Living Spaces",
    subtitle: "Contemporary Comfort",
    description: "Transform your living space with our curated collection of modern furniture and stylish accessories",
    image: "/showcase/modern-living-interior.avif",
    category: "Living Room",
    link: "/category/living-room",
    animationClass: "animate-float",
  },
  {
    id: "bedroom",
    title: "Serene Bedroom Collection",
    subtitle: "Peaceful Retreat",
    description: "Create your perfect sanctuary with our elegant bedroom furniture and cozy textiles",
    image: "/showcase/modern-bedroom.avif",
    category: "Bedroom",
    link: "/category/bedroom",
    animationClass: "animate-pulse-slow",
  },
  {
    id: "office",
    title: "Executive Office Solutions",
    subtitle: "Professional Excellence",
    description: "Elevate your workspace with our premium executive office furniture and modern desk solutions",
    image: "/showcase/modern-office-setup.png",
    category: "Executive Office",
    link: "/category/executive-office",
    animationClass: "animate-swing",
  },
  {
    id: "decor",
    title: "Home Decor Essentials",
    subtitle: "Stylish Accents",
    description: "Complete your home with our carefully selected decor pieces and artistic accessories",
    image: "/showcase/home-decor.avif",
    category: "Home Decor",
    link: "/category/home-decor",
    animationClass: "animate-bounce-slow",
  },
]

export function FurnitureShowcaseSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      {/* Google Fonts Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <section
        className="w-full overflow-hidden"
        style={{
          minHeight: "650px",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingTop: "5%",
          paddingBottom: "5%",
          marginBottom: "2rem",
        }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ height: "600px" }}>
          {/* Left Column - Large Portrait Image */}
          <div className="lg:col-span-5 relative group cursor-pointer rounded-2xl overflow-hidden">
            <div
              className="relative w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
              onMouseEnter={() => setHoveredItem(showcaseItems[0].id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Image
                src={showcaseItems[0].image || "/placeholder.svg"}
                alt={showcaseItems[0].title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Hover Content */}
            {hoveredItem === showcaseItems[0].id && (
              <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-8 rounded-2xl">
                <div className="text-white space-y-4 animate-slide-in-left">
                  <div className={`dancing-script text-2xl font-medium ${showcaseItems[0].animationClass}`}>
                    {showcaseItems[0].subtitle}
                  </div>
                  <h3 className="text-3xl font-bold leading-tight animate-slide-in-left-delay-1">
                    {showcaseItems[0].title}
                  </h3>
                  <p className="text-lg leading-relaxed max-w-md animate-slide-in-left-delay-2">
                    {showcaseItems[0].description}
                  </p>
                  <Link
                    href={showcaseItems[0].link}
                    className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors animate-slide-in-left-delay-3"
                  >
                    <span className="text-sm font-medium">Explore {showcaseItems[0].category}</span>
                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 grid grid-rows-2 gap-4" style={{ height: "600px" }}>
            {/* Top Row - Landscape Image */}
            <div
              className="relative group cursor-pointer rounded-2xl overflow-hidden"
              style={{ height: "calc(300px - 8px)" }}
            >
              <div
                className="relative w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                onMouseEnter={() => setHoveredItem(showcaseItems[1].id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Image
                  src={showcaseItems[1].image || "/placeholder.svg"}
                  alt={showcaseItems[1].title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Hover Content */}
              {hoveredItem === showcaseItems[1].id && (
                <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-6 rounded-2xl">
                  <div className="text-white space-y-3 animate-slide-in-left">
                    <div className={`dancing-script text-xl font-medium ${showcaseItems[1].animationClass}`}>
                      {showcaseItems[1].subtitle}
                    </div>
                    <h3 className="text-2xl font-bold leading-tight animate-slide-in-left-delay-1">
                      {showcaseItems[1].title}
                    </h3>
                    <p className="text-base leading-relaxed animate-slide-in-left-delay-2">
                      {showcaseItems[1].description}
                    </p>
                    <Link
                      href={showcaseItems[1].link}
                      className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors animate-slide-in-left-delay-3"
                    >
                      <span className="text-sm font-medium">Explore {showcaseItems[1].category}</span>
                      <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Row - Two Square Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: "calc(300px - 8px)" }}>
              {/* Bottom Left Square */}
              <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
                <div
                  className="relative w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                  onMouseEnter={() => setHoveredItem(showcaseItems[2].id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Image
                    src={showcaseItems[2].image || "/placeholder.svg"}
                    alt={showcaseItems[2].title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Hover Content */}
                {hoveredItem === showcaseItems[2].id && (
                  <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4 rounded-2xl">
                    <div className="text-white space-y-2 animate-slide-in-left">
                      <div className={`dancing-script text-lg font-medium ${showcaseItems[2].animationClass}`}>
                        {showcaseItems[2].subtitle}
                      </div>
                      <h3 className="text-xl font-bold leading-tight animate-slide-in-left-delay-1">
                        {showcaseItems[2].title}
                      </h3>
                      <p className="text-sm leading-relaxed animate-slide-in-left-delay-2">
                        {showcaseItems[2].description}
                      </p>
                      <Link
                        href={showcaseItems[2].link}
                        className="inline-flex items-center gap-1 text-white hover:text-gray-200 transition-colors animate-slide-in-left-delay-3"
                      >
                        <span className="text-xs font-medium">Explore {showcaseItems[2].category}</span>
                        <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Right Square */}
              <div className="relative group cursor-pointer rounded-2xl overflow-hidden">
                <div
                  className="relative w-full h-full transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
                  onMouseEnter={() => setHoveredItem(showcaseItems[3].id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Image
                    src={showcaseItems[3].image || "/placeholder.svg"}
                    alt={showcaseItems[3].title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Hover Content */}
                {hoveredItem === showcaseItems[3].id && (
                  <div className="absolute inset-0 bg-black/40 flex items-start justify-start p-4 rounded-2xl">
                    <div className="text-white space-y-2 animate-slide-in-left">
                      <div className={`dancing-script text-lg font-medium ${showcaseItems[3].animationClass}`}>
                        {showcaseItems[3].subtitle}
                      </div>
                      <h3 className="text-xl font-bold leading-tight animate-slide-in-left-delay-1">
                        {showcaseItems[3].title}
                      </h3>
                      <p className="text-sm leading-relaxed animate-slide-in-left-delay-2">
                        {showcaseItems[3].description}
                      </p>
                      <Link
                        href={showcaseItems[3].link}
                        className="inline-flex items-center gap-1 text-white hover:text-gray-200 transition-colors animate-slide-in-left-delay-3"
                      >
                        <span className="text-xs font-medium">Explore {showcaseItems[3].category}</span>
                        <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .dancing-script {
            font-family: 'Dancing Script', cursive;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes swing {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(3deg); }
            75% { transform: rotate(-3deg); }
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          
          @keyframes slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
          
          .animate-swing {
            animation: swing 2s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          .animate-slide-in-left {
            animation: slide-in-left 0.6s ease-out;
          }
          
          .animate-slide-in-left-delay-1 {
            animation: slide-in-left 0.6s ease-out 0.1s both;
          }
          
          .animate-slide-in-left-delay-2 {
            animation: slide-in-left 0.6s ease-out 0.2s both;
          }
          
          .animate-slide-in-left-delay-3 {
            animation: slide-in-left 0.6s ease-out 0.3s both;
          }
        `}</style>
      </section>
    </>
  )
}
