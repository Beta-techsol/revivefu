"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const bedroomImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=700&h=500&fit=crop",
    alt: "Modern King Size Bed",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=700&h=500&fit=crop",
    alt: "Luxury Bedroom Set",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&h=500&fit=crop",
    alt: "Contemporary Bedroom",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=700&h=500&fit=crop",
    alt: "Minimalist Bedroom",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&h=500&fit=crop",
    alt: "Elegant Bedroom",
  },
]

export function ProductShowcase() {
  const [isInView, setIsInView] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
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

  // Auto-rotate images every 5 seconds with smooth electron-like transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bedroomImages.length)

        setTimeout(() => {
          setIsTransitioning(false)
        }, 800)
      }, 400)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Calculate electron orbit positions with increased radius and circular orbiting images
  const getElectronPosition = (index: number, currentIndex: number, total: number) => {
    const relativeIndex = (index - currentIndex + total) % total

    // Featured image is at center
    if (relativeIndex === 0) {
      return {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
        isFeatured: true,
      }
    }

    // Calculate orbit positions for other images with increased radius
    const orbitIndex = relativeIndex - 1
    const orbitTotal = total - 1
    const angle = (orbitIndex * 360) / orbitTotal
    const radius = 220 // Orbit radius

    const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
    const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

    return {
      x,
      y,
      scale: 0.6, // Scale for better visibility
      opacity: 0.9, // High opacity
      zIndex: 5,
      isFeatured: false,
    }
  }

  return (
    <section ref={sectionRef} className="py-12 bg-white relative overflow-hidden">
      {/* Add Poppins font */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        .dancing-font {
          font-family: 'Dancing Script', cursive;
        }
        .poppins-font {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Main Showcase Container - Responsive height: 850px on mobile, 550px on desktop */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl h-[850px] lg:h-[550px] transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
            }`}
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%), url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=600&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Orbit Ring Indicators - Increased size */}
              <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-[440px] h-[440px] border border-white/10 rounded-full animate-rotate-slow"></div>
                <div className="absolute inset-4 border border-white/5 rounded-full animate-rotate-reverse"></div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-16 left-16 w-2 h-2 bg-[#C53D39]/30 rounded-full animate-float"></div>
              <div className="absolute top-32 right-24 w-1 h-1 bg-[#F1BA69]/40 rounded-full animate-float-delayed"></div>
              <div className="absolute bottom-24 left-12 w-3 h-3 bg-white/20 rounded-full animate-float-slow"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 h-[850px] lg:h-[550px] relative z-10">
              {/* Left Side - Electron Orbit Carousel */}
              <div className="relative flex items-center justify-center p-4 lg:p-8">
                {/* Electron Orbit Container - Increased Size */}
                <div className="relative w-full max-w-lg h-[450px]">
                  {/* Central Nucleus Glow */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-[#C53D39]/50 to-[#F1BA69]/50 rounded-full blur-sm animate-pulse z-10"></div>

                  {/* Electron Images */}
                  <div className="relative w-full h-full">
                    {bedroomImages.map((image, index) => {
                      const position = getElectronPosition(index, currentImageIndex, bedroomImages.length)

                      return (
                        <div
                          key={image.id}
                          className={`absolute transition-all duration-1000 ease-in-out cursor-pointer ${
                            isTransitioning ? "duration-1200" : ""
                          }`}
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                            opacity: position.opacity,
                            zIndex: position.zIndex,
                          }}
                          onClick={() => {
                            if (!position.isFeatured) {
                              setIsTransitioning(true)
                              setTimeout(() => {
                                setCurrentImageIndex(index)
                                setTimeout(() => {
                                  setIsTransitioning(false)
                                }, 800)
                              }, 400)
                            }
                          }}
                        >
                          {/* Image Container - Circular orbiting images */}
                          <div
                            className={`relative overflow-hidden shadow-2xl transition-all duration-500 ${
                              position.isFeatured
                                ? "w-72 h-56 sm:w-80 sm:h-60 lg:w-88 lg:h-66 rounded-2xl" // Featured image remains rectangular
                                : "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full hover:scale-110 hover:shadow-xl border-2 border-white/50" // Circular orbiting images
                            }`}
                          >
                            <Image
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              fill
                              className="object-cover"
                              priority={position.isFeatured}
                            />

                            {/* Electron Glow Effect for Orbiting Images */}
                            {!position.isFeatured && (
                              <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                            )}
                          </div>

                          {/* Featured Badge - Only for center image */}
                          {position.isFeatured && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                              Featured
                            </div>
                          )}

                          {/* Electron Trail Effect */}
                          {!position.isFeatured && (
                            <div
                              className="absolute inset-0 rounded-full opacity-30"
                              style={{
                                background: `radial-gradient(circle, rgba(197, 61, 57, 0.3) 0%, transparent 70%)`,
                                animation: "electron-trail 2s ease-in-out infinite",
                                animationDelay: `${index * 0.4}s`,
                              }}
                            ></div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Orbit Path Visualization - Increased size */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-[440px] h-[440px] border border-dashed border-white/20 rounded-full animate-rotate-slow"></div>
                  </div>

                  {/* Decorative Elements - Responsive */}
                  <div className="absolute -left-4 bottom-4 lg:-left-8 lg:bottom-8 animate-float">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
                      <Image
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop"
                        alt="Bedside Accessories"
                        fill
                        className="rounded-2xl shadow-xl object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Additional Floating Elements */}
                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-[#F1BA69] to-[#C53D39] rounded-full animate-bounce opacity-70"></div>
                  <div className="absolute bottom-12 right-8 sm:bottom-14 sm:right-10 lg:bottom-16 lg:right-12 w-3 h-3 sm:w-4 sm:h-4 bg-white/50 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Right Side - Content with Ultra Light Opacity Vectors */}
              <div className="flex flex-col justify-center p-4 sm:p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm relative overflow-hidden">
                {/* Ultra Light Opacity Vector Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Ultra Light Geometric Shapes with Minimal Opacity */}
                  <div className="absolute top-4 right-4 w-32 h-32 border border-[#C53D39]/2 rounded-lg rotate-12 animate-float-gentle"></div>
                  <div className="absolute top-16 right-16 w-24 h-24 bg-gradient-to-r from-[#F1BA69]/1 to-[#C53D39]/1 rounded-full animate-pulse-gentle"></div>
                  <div className="absolute top-32 right-8 w-20 h-20 border-2 border-[#F1BA69]/3 rounded-lg rotate-45 animate-bed-sway"></div>
                  <div className="absolute top-48 right-20 w-16 h-16 bg-[#C53D39]/2 rounded-full animate-bed-bounce"></div>

                  {/* Additional Ultra Light Vector Shapes */}
                  <div className="absolute top-8 right-32 w-28 h-28 border border-dashed border-[#C53D39]/2 rounded-full animate-rotate-slow"></div>
                  <div className="absolute top-24 right-12 w-18 h-18 bg-gradient-to-br from-[#F1BA69]/1 to-transparent rounded-lg rotate-30 animate-float-slow"></div>
                  <div className="absolute top-40 right-28 w-14 h-14 border-2 border-[#F1BA69]/2 rotate-60 animate-bed-float"></div>

                  {/* Mid-section vectors with ultra light opacity */}
                  <div className="absolute top-1/2 right-6 w-22 h-22 border border-[#C53D39]/2 rounded-lg transform -rotate-12 animate-pillow-float"></div>
                  <div className="absolute top-1/2 right-24 w-26 h-26 bg-gradient-radial from-[#F1BA69]/1 to-transparent rounded-full animate-pulse-radial"></div>
                  <div className="absolute top-1/2 right-40 w-20 h-20 border-2 border-dashed border-[#C53D39]/2 rounded-full animate-rotate-reverse"></div>

                  {/* Bottom section vectors with minimal opacity */}
                  <div className="absolute bottom-8 right-8 w-30 h-30 border border-[#F1BA69]/2 rounded-lg rotate-15 animate-bed-sway"></div>
                  <div className="absolute bottom-16 right-20 w-24 h-24 bg-[#C53D39]/1 rounded-full animate-float-gentle"></div>
                  <div className="absolute bottom-24 right-12 w-18 h-18 border-2 border-[#F1BA69]/3 rotate-45 animate-pillow-sway"></div>
                  <div className="absolute bottom-32 right-32 w-16 h-16 bg-gradient-to-r from-[#C53D39]/1 to-[#F1BA69]/1 rounded-lg animate-bed-bounce"></div>

                  {/* Bed-themed Geometric Shapes with ultra light opacity */}
                  <div className="absolute top-12 right-14 w-20 h-12 border border-[#C53D39]/2 rounded-lg animate-bed-float"></div>
                  <div className="absolute top-28 right-26 w-16 h-10 bg-gradient-to-r from-[#F1BA69]/1 to-[#C53D39]/1 rounded-lg animate-bed-sway"></div>
                  <div className="absolute bottom-20 right-16 w-12 h-8 border border-[#F1BA69]/3 rounded-lg animate-bed-bounce"></div>

                  {/* Pillow-like shapes with minimal visibility */}
                  <div className="absolute top-1/3 right-10 w-14 h-10 bg-[#C53D39]/2 rounded-full animate-pillow-float"></div>
                  <div className="absolute top-1/2 right-18 w-12 h-8 bg-[#F1BA69]/2 rounded-full animate-pillow-sway"></div>
                  <div className="absolute bottom-1/3 right-14 w-16 h-12 bg-gradient-to-r from-[#C53D39]/1 to-[#F1BA69]/1 rounded-full animate-pillow-float"></div>

                  {/* Floating dots with ultra light opacity */}
                  <div className="absolute top-10 right-18 w-3 h-3 bg-[#C53D39]/5 rounded-full animate-bed-dots"></div>
                  <div className="absolute top-20 right-10 w-2 h-2 bg-[#F1BA69]/6 rounded-full animate-bed-dots-delayed"></div>
                  <div className="absolute top-36 right-22 w-4 h-4 bg-[#C53D39]/4 rounded-full animate-bed-dots-slow"></div>
                  <div className="absolute bottom-12 right-22 w-3 h-3 bg-[#F1BA69]/5 rounded-full animate-bed-dots"></div>
                  <div className="absolute bottom-28 right-14 w-2 h-2 bg-[#C53D39]/4 rounded-full animate-bed-dots-delayed"></div>

                  {/* Enhanced SVG vectors with ultra light opacity */}
                  <svg className="absolute inset-0 w-full h-full opacity-2" viewBox="0 0 400 550">
                    {/* Ultra light bed outlines */}
                    <rect
                      x="280"
                      y="200"
                      width="80"
                      height="50"
                      rx="8"
                      stroke="url(#bedGradient1)"
                      strokeWidth="0.5"
                      fill="none"
                      className="animate-bed-draw"
                    />
                    <rect
                      x="285"
                      y="180"
                      width="70"
                      height="15"
                      rx="4"
                      stroke="url(#bedGradient2)"
                      strokeWidth="0.5"
                      fill="none"
                      className="animate-bed-draw-delayed"
                    />

                    {/* Ultra light headboard */}
                    <rect
                      x="275"
                      y="170"
                      width="90"
                      height="25"
                      rx="12"
                      stroke="url(#bedGradient3)"
                      strokeWidth="0.5"
                      fill="none"
                      className="animate-bed-draw-slow"
                    />

                    {/* Ultra light pillows */}
                    <ellipse
                      cx="300"
                      cy="190"
                      rx="12"
                      ry="8"
                      stroke="url(#bedGradient1)"
                      strokeWidth="0.3"
                      fill="none"
                      className="animate-pillow-draw"
                    />
                    <ellipse
                      cx="340"
                      cy="190"
                      rx="12"
                      ry="8"
                      stroke="url(#bedGradient2)"
                      strokeWidth="0.3"
                      fill="none"
                      className="animate-pillow-draw-delayed"
                    />

                    {/* Additional ultra light geometric shapes */}
                    <circle
                      cx="320"
                      cy="120"
                      r="15"
                      stroke="url(#bedGradient1)"
                      strokeWidth="0.3"
                      fill="none"
                      className="animate-bed-draw"
                    />
                    <polygon
                      points="350,140 370,160 350,180 330,160"
                      stroke="url(#bedGradient2)"
                      strokeWidth="0.3"
                      fill="none"
                      className="animate-bed-draw-delayed"
                    />

                    <defs>
                      <linearGradient id="bedGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C53D39" stopOpacity="0.02">
                          <animate
                            attributeName="stop-opacity"
                            values="0.02;0.05;0.02"
                            dur="4s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="100%" stopColor="#F1BA69" stopOpacity="0.02">
                          <animate
                            attributeName="stop-opacity"
                            values="0.02;0.05;0.02"
                            dur="4s"
                            repeatCount="indefinite"
                            begin="2s"
                          />
                        </stop>
                      </linearGradient>
                      <linearGradient id="bedGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F1BA69" stopOpacity="0.015">
                          <animate
                            attributeName="stop-opacity"
                            values="0.015;0.04;0.015"
                            dur="5s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="100%" stopColor="#C53D39" stopOpacity="0.015">
                          <animate
                            attributeName="stop-opacity"
                            values="0.015;0.04;0.015"
                            dur="5s"
                            repeatCount="indefinite"
                            begin="2.5s"
                          />
                        </stop>
                      </linearGradient>
                      <linearGradient id="bedGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C53D39" stopOpacity="0.025">
                          <animate
                            attributeName="stop-opacity"
                            values="0.025;0.06;0.025"
                            dur="6s"
                            repeatCount="indefinite"
                          />
                        </stop>
                        <stop offset="100%" stopColor="#F1BA69" stopOpacity="0.025">
                          <animate
                            attributeName="stop-opacity"
                            values="0.025;0.06;0.025"
                            dur="6s"
                            repeatCount="indefinite"
                            begin="3s"
                          />
                        </stop>
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Radial Gradient Overlays with ultra light opacity */}
                  <div className="absolute top-6 right-6 w-40 h-40 bg-gradient-radial from-[#C53D39]/1 to-transparent rounded-full animate-pulse-radial"></div>
                  <div className="absolute bottom-10 right-4 w-32 h-32 bg-gradient-radial from-[#F1BA69]/1 to-transparent rounded-full animate-pulse-radial-delayed"></div>
                  <div className="absolute top-1/2 right-8 w-36 h-36 bg-gradient-radial from-[#C53D39]/0.5 to-transparent rounded-full animate-pulse-radial"></div>
                </div>

                <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative z-10">
                  {/* Stylish Header */}
                  <div
                    className={`transition-all duration-1000 delay-300 ${
                      isInView ? "opacity-100 translate-x-0 rotate-0" : "opacity-0 translate-x-8 rotate-3"
                    }`}
                  >
                    <span className="dancing-font text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent animate-gradient">
                      Great Range of
                    </span>
                  </div>

                  {/* Main Heading - Font Weight 500 */}
                  <div
                    className={`transition-all duration-1000 delay-500 ${
                      isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                  >
                    <h2 className="poppins-font text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium text-gray-900 leading-tight">
                      <span className="block">Bedroom</span>
                      <span className="block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Furniture
                      </span>
                    </h2>
                  </div>

                  {/* Description - Font Weight 400 */}
                  <div
                    className={`transition-all duration-1000 delay-700 ${
                      isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute -left-3 sm:-left-4 top-0 w-1 h-full bg-gradient-to-b from-[#C53D39] to-[#F1BA69] rounded-full"></div>
                      <p className="poppins-font text-gray-700 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed max-w-sm sm:max-w-md pl-4 sm:pl-6 font-normal">
                        Strong mattress support with <span className="text-[#C53D39] font-bold">10 wood slats</span>{" "}
                        prevents sagging and increases mattress life
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Shop Now Button - Font Weight 400 with Left-Right Fill Effect */}
                  <div
                    className={`pt-4 sm:pt-6 transition-all duration-1000 delay-900 ${
                      isInView ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-8 scale-95"
                    }`}
                  >
                    <Link href="/category/bedroom">
                      <button
                        className="group relative bg-white text-gray-900 font-normal text-sm sm:text-base lg:text-lg border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden poppins-font"
                        style={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          paddingLeft: "30px",
                          paddingRight: "30px",
                          borderRadius: "7px",
                          borderWidth: "1px",
                        }}
                      >
                        {/* Left-Right Fill Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>

                        {/* Left Fill */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                        {/* Right Fill */}
                        <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out delay-100"></div>

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-300"></div>

                        {/* Button Content */}
                        <span className="relative z-10 flex items-center justify-center space-x-2 transition-all duration-500">
                          <span className="transition-colors duration-300">Shop Now</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx global>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes electron-trail {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.2); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-8px) rotate(12deg); }
        }
        
        @keyframes bed-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        
        @keyframes bed-sway {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(8px) translateY(-8px); }
        }
        
        @keyframes bed-bounce {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        
        @keyframes pillow-float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes pillow-sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(-6px) rotate(-3deg); }
        }
        
        @keyframes bed-dots {
          0%, 100% { transform: translateY(0px); opacity: 0.05; }
          50% { transform: translateY(-8px); opacity: 0.12; }
        }
        
        @keyframes bed-dots-delayed {
          0%, 100% { transform: translateY(0px); opacity: 0.06; }
          50% { transform: translateY(-6px); opacity: 0.15; }
        }
        
        @keyframes bed-dots-slow {
          0%, 100% { transform: translateY(0px); opacity: 0.04; }
          50% { transform: translateY(-4px); opacity: 0.10; }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.01; transform: scale(1); }
          50% { opacity: 0.03; transform: scale(1.1); }
        }
        
        @keyframes pulse-radial {
          0%, 100% { opacity: 0.01; transform: scale(1); }
          50% { opacity: 0.03; transform: scale(1.2); }
        }
        
        @keyframes pulse-radial-delayed {
          0%, 100% { opacity: 0.01; transform: scale(1); }
          50% { opacity: 0.04; transform: scale(1.3); }
        }
        
        @keyframes bed-draw {
          0% { stroke-dasharray: 0 300; opacity: 0.02; }
          50% { opacity: 0.05; }
          100% { stroke-dasharray: 300 0; opacity: 0.02; }
        }
        
        @keyframes pillow-draw {
          0% { stroke-dasharray: 0 100; opacity: 0.015; }
          50% { opacity: 0.04; }
          100% { stroke-dasharray: 100 0; opacity: 0.015; }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-rotate-slow { 
          animation: rotate-slow 30s linear infinite; 
        }
        
        .animate-rotate-reverse { 
          animation: rotate-reverse 25s linear infinite; 
        }
        
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        
        .animate-float-delayed { 
          animation: float-delayed 6s ease-in-out infinite 2s; 
        }
        
        .animate-float-slow { 
          animation: float-slow 8s ease-in-out infinite 1s; 
        }
        
        .animate-float-gentle {
          animation: float-gentle 8s ease-in-out infinite;
        }
        
        .animate-bed-float {
          animation: bed-float 7s ease-in-out infinite;
        }
        
        .animate-bed-sway {
          animation: bed-sway 8s ease-in-out infinite 1s;
        }
        
        .animate-bed-bounce {
          animation: bed-bounce 5s ease-in-out infinite 2s;
        }
        
        .animate-pillow-float {
          animation: pillow-float 6s ease-in-out infinite;
        }
        
        .animate-pillow-sway {
          animation: pillow-sway 7s ease-in-out infinite 1.5s;
        }
        
        .animate-bed-dots {
          animation: bed-dots 4s ease-in-out infinite;
        }
        
        .animate-bed-dots-delayed {
          animation: bed-dots-delayed 5s ease-in-out infinite 1s;
        }
        
        .animate-bed-dots-slow {
          animation: bed-dots-slow 6s ease-in-out infinite 2s;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
        
        .animate-pulse-radial {
          animation: pulse-radial 5s ease-in-out infinite;
        }
        
        .animate-pulse-radial-delayed {
          animation: pulse-radial-delayed 6s ease-in-out infinite 2s;
        }
        
        .animate-bed-draw {
          stroke-dasharray: 300;
          animation: bed-draw 8s ease-in-out infinite;
        }
        
        .animate-bed-draw-delayed {
          stroke-dasharray: 300;
          animation: bed-draw 10s ease-in-out infinite 2s;
        }
        
        .animate-bed-draw-slow {
          stroke-dasharray: 300;
          animation: bed-draw 12s ease-in-out infinite 4s;
        }
        
        .animate-pillow-draw {
          stroke-dasharray: 100;
          animation: pillow-draw 6s ease-in-out infinite;
        }
        
        .animate-pillow-draw-delayed {
          stroke-dasharray: 100;
          animation: pillow-draw 8s ease-in-out infinite 2s;
        }
        
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .opacity-2 {
          opacity: 0.02;
        }
      `}</style>
    </section>
  )
}
