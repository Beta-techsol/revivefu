"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
}

const featuredProducts: Product[] = [
  {
    id: "hero-1",
    name: "Luxe Sectional Sofa",
    price: 2299.99,
    originalPrice: 2899.99,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    description: "Premium leather sectional with ergonomic design and built-in USB charging ports for modern living",
    category: "Living Room",
  },
  {
    id: "hero-2",
    name: "Executive Office Chair",
    price: 899.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop",
    description: "Ergonomic office chair with lumbar support and premium materials for all-day comfort",
    category: "Office",
  },
  {
    id: "hero-3",
    name: "Modern Dining Set",
    price: 1599.99,
    originalPrice: 1999.99,
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=600&fit=crop",
    description: "Contemporary 8-seater dining table with matching chairs in premium oak finish",
    category: "Dining Room",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)
  const productImageRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    const handleScroll = () => {
      // Check if current slide has already been animated
      if (hasAnimated[currentSlide] || !heroRef.current || !productImageRef.current) return

      const scrollY = window.scrollY
      const heroHeight = heroRef.current.offsetHeight

      // Trigger animation only once when user scrolls 40% of hero
      if (scrollY > heroHeight * 0.4) {
        setHasAnimated((prev) => ({ ...prev, [currentSlide]: true }))
        animateProductToListing()
      }
    }

    const animateProductToListing = () => {
      const currentProduct = featuredProducts[currentSlide]
      const productImageElement = productImageRef.current
      const targetElement = document.getElementById(`product-${currentProduct.id}`)

      if (!productImageElement || !targetElement) return

      // Get the product card's image container (first child with aspect-square class)
      const targetImageContainer = targetElement.querySelector(".aspect-square")
      if (!targetImageContainer) return

      // Get exact positions
      const imageRect = productImageElement.getBoundingClientRect()

      // Create the floating image element
      const floatingImage = document.createElement("div")
      floatingImage.style.cssText = `
        position: fixed;
        left: ${imageRect.left}px;
        top: ${imageRect.top}px;
        width: ${imageRect.width}px;
        height: ${imageRect.height}px;
        z-index: 1000;
        border-radius: 24px;
        overflow: hidden;
        opacity: 1;
        transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: scale(1) rotate(0deg);
        pointer-events: none;
      `

      // Add the image with 100% opacity
      floatingImage.innerHTML = `
        <img src="${currentProduct.image}" alt="${currentProduct.name}" 
             style="width: 100%; height: 100%; object-fit: cover; opacity: 1; border-radius: 7px;" />
      `

      document.body.appendChild(floatingImage)

      // Slightly dim the original image during animation
      productImageElement.style.opacity = "0.4"
      productImageElement.style.transition = "opacity 0.3s ease"

      // Start the realistic animation after a brief delay
      setTimeout(() => {
        // Get fresh target position (targeting the image container specifically)
        const newTargetRect = targetImageContainer.getBoundingClientRect()

        // Calculate final position (no scroll offset needed for fixed positioning)
        const finalLeft = newTargetRect.left
        const finalTop = newTargetRect.top
        const finalWidth = newTargetRect.width
        const finalHeight = newTargetRect.height

        // Apply the transformation with realistic physics
        floatingImage.style.cssText += `
          left: ${finalLeft}px;
          top: ${finalTop}px;
          width: ${finalWidth}px;
          height: ${finalHeight}px;
          transform: scale(0.98) rotate(-1deg);
          opacity: 1;
          border-radius: 16px;
        `
      }, 200)

      // Perfect alignment phase
      setTimeout(() => {
        const finalTargetRect = targetImageContainer.getBoundingClientRect()

        floatingImage.style.cssText += `
          left: ${finalTargetRect.left}px;
          top: ${finalTargetRect.top}px;
          width: ${finalTargetRect.width}px;
          height: ${finalTargetRect.height}px;
          transform: scale(1) rotate(0deg);
          opacity: 1;
          border-radius: 12px;
        `
      }, 2000)

      // Fade out and cleanup
      setTimeout(() => {
        floatingImage.style.opacity = "0"
        floatingImage.style.transform = "scale(1.02)"
      }, 2300)

      // Final cleanup and restore original image
      setTimeout(() => {
        if (document.body.contains(floatingImage)) {
          document.body.removeChild(floatingImage)
        }
        productImageElement.style.opacity = "1"
      }, 2800)

      // Highlight the target product briefly
      setTimeout(() => {
        const targetCard = targetElement.closest(".group")
        if (targetCard) {
          const cardElement = targetCard as HTMLElement
          cardElement.style.transform = "translateY(-8px) scale(1.02)"
          cardElement.style.boxShadow = "0 25px 50px rgba(197, 61, 57, 0.15)"
          cardElement.style.transition = "all 0.5s ease"

          setTimeout(() => {
            cardElement.style.transform = ""
            cardElement.style.boxShadow = ""
          }, 1000)
        }
      }, 2400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [currentSlide, hasAnimated])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentProduct = featuredProducts[currentSlide]

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#F1BA69]/5 overflow-hidden"
    >
      {/* Background decoration with rotating and floating vectors */}
      <div className="absolute inset-0">
        {/* Original gradient backgrounds */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F1BA69]/10 to-[#C53D39]/10 rounded-full blur-3xl"></div>

        {/* Rotating and floating vectors */}
        <div className="absolute top-16 left-16 w-24 h-24 border-2 border-[#C53D39]/20 rounded-lg rotate-45 animate-float-rotate"></div>
        <div className="absolute top-32 right-24 w-20 h-20 bg-gradient-to-r from-[#F1BA69]/10 to-[#C53D39]/10 rounded-full animate-float-gentle"></div>
        <div className="absolute bottom-32 left-20 w-16 h-16 border-2 border-[#F1BA69]/20 rotate-12 animate-rotate-slow"></div>
        <div className="absolute bottom-16 right-32 w-28 h-28 border border-dashed border-[#C53D39]/15 rounded-full animate-pulse-rotate"></div>

        {/* Additional floating geometric shapes */}
        <div className="absolute top-1/4 left-8 w-12 h-12 bg-[#C53D39]/5 transform rotate-45 animate-float-slow"></div>
        <div className="absolute top-1/2 right-8 w-14 h-14 border-2 border-[#F1BA69]/15 rounded-lg animate-rotate-reverse"></div>
        <div className="absolute bottom-1/4 left-12 w-10 h-10 bg-gradient-to-br from-[#C53D39]/8 to-[#F1BA69]/8 rounded-full animate-float-bounce"></div>
        <div className="absolute bottom-1/3 right-16 w-18 h-18 border border-[#C53D39]/10 rotate-30 animate-float-sway"></div>

        {/* Floating dots with various animations */}
        <div className="absolute top-12 left-32 w-3 h-3 bg-[#F1BA69]/30 rounded-full animate-float-dot"></div>
        <div className="absolute top-48 right-12 w-2 h-2 bg-[#C53D39]/25 rounded-full animate-float-dot-delayed"></div>
        <div className="absolute bottom-24 left-8 w-4 h-4 bg-[#F1BA69]/20 rounded-full animate-float-dot-slow"></div>
        <div className="absolute bottom-48 right-20 w-2 h-2 bg-[#C53D39]/30 rounded-full animate-float-dot"></div>

        {/* SVG vectors with rotation */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1200 800">
          <g className="animate-rotate-slow origin-center">
            <polygon points="100,100 120,80 140,100 120,120" fill="url(#heroGradient1)" opacity="0.3" />
            <circle cx="200" cy="150" r="15" stroke="url(#heroGradient2)" strokeWidth="2" fill="none" opacity="0.4" />
          </g>
          <g className="animate-rotate-reverse origin-center">
            <rect
              x="1000"
              y="200"
              width="30"
              height="30"
              rx="5"
              fill="url(#heroGradient1)"
              opacity="0.2"
              transform="rotate(45 1015 215)"
            />
            <polygon
              points="1100,300 1120,280 1140,300 1120,320"
              stroke="url(#heroGradient2)"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </g>
          <g className="animate-float-gentle">
            <circle cx="150" cy="600" r="20" stroke="url(#heroGradient1)" strokeWidth="1" fill="none" opacity="0.25" />
            <rect x="1050" y="600" width="25" height="25" rx="3" fill="url(#heroGradient2)" opacity="0.2" />
          </g>

          <defs>
            <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C53D39" />
              <stop offset="100%" stopColor="#F1BA69" />
            </linearGradient>
            <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1BA69" />
              <stop offset="100%" stopColor="#C53D39" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            {/* Left content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-6 py-3 rounded-full text-sm font-medium font-poppins tracking-wide">
                  {currentProduct.category.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block text-gray-900">{currentProduct.name.split(" ")[0]}</span>
                  <span className="block bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
                    {currentProduct.name.split(" ").slice(1).join(" ")}
                  </span>
                </h1>

                <p className="text-xl text-gray-600 max-w-lg leading-relaxed">{currentProduct.description}</p>
              </div>

              <div className="flex items-baseline space-x-4">
                <span className="text-5xl font-bold text-[#C53D39]">${currentProduct.price.toFixed(2)}</span>
                {currentProduct.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${currentProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="xl" className="group text-lg px-8 py-4 font-normal relative overflow-hidden">
                  {/* Layer 1: Left Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                  {/* Layer 2: Right Fill */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100"></div>

                  {/* Layer 3: Center Convergence Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center"></div>

                  {/* Shimmer Overlay - Final sparkle effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500"></div>

                  <span className="font-poppins relative z-10">Shop Now</span>
                  <span className="group-hover:translate-x-1 transition-transform ml-2 relative z-10">→</span>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="font-poppins bg-transparent text-lg px-8 py-4 font-normal relative overflow-hidden group"
                >
                  {/* Layer 1: Left Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                  {/* Layer 2: Right Fill */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100"></div>

                  {/* Layer 3: Center Convergence Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center"></div>

                  {/* Shimmer Overlay - Final sparkle effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500"></div>

                  <span className="relative z-10">View Details</span>
                </Button>
              </div>

              {/* Product indicators */}
              <div className="flex items-center space-x-4 pt-8">
                <div className="flex space-x-2">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-8"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-500 font-poppins">
                  {currentSlide + 1} / {featuredProducts.length}
                </div>
              </div>
            </div>

            {/* Right content - Single Product Image with 7px radius */}
            <div className="relative">
              <div className="relative w-full h-[600px] lg:h-[700px]">
                {/* Main product image with 7px border radius */}
                <div
                  ref={productImageRef}
                  className="relative w-full h-full overflow-hidden transition-all duration-700 ease-out"
                  style={{
                    backgroundColor: "transparent",
                    borderRadius: "7px",
                  }}
                >
                  <Image
                    src={currentProduct.image || "/placeholder.svg"}
                    alt={currentProduct.name}
                    fill
                    className="object-contain transition-all duration-700 ease-out"
                    style={{
                      backgroundColor: "transparent",
                      borderRadius: "7px",
                    }}
                    priority
                  />
                </div>

                {/* Navigation arrows with Multi-layer fill effects */}
                <button
                  onClick={prevSlide}
                  className="hero-nav-button group absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-900 font-normal border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden rounded-full flex items-center justify-center relative"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {/* Layer 1: Left Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></div>

                  {/* Layer 2: Right Fill */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100 rounded-full"></div>

                  {/* Layer 3: Center Convergence Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center rounded-full"></div>

                  {/* Shimmer Overlay - Final sparkle effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500 rounded-full"></div>

                  <ChevronLeft className="h-6 w-6 text-[#C53D39] group-hover:text-white relative z-10 transition-colors duration-300" />
                </button>

                <button
                  onClick={nextSlide}
                  className="hero-nav-button group absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-900 font-normal border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden rounded-full flex items-center justify-center relative"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  {/* Layer 1: Left Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out rounded-full"></div>

                  {/* Layer 2: Right Fill */}
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100 rounded-full"></div>

                  {/* Layer 3: Center Convergence Fill */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center rounded-full"></div>

                  {/* Shimmer Overlay - Final sparkle effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500 rounded-full"></div>

                  <ChevronRight className="h-6 w-6 text-[#C53D39] group-hover:text-white relative z-10 transition-colors duration-300" />
                </button>

                {/* Floating elements */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#F1BA69]/20 to-[#C53D39]/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#C53D39] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-[#C53D39] to-[#F1BA69] rounded-full mt-2"></div>
        </div>
      </div>

      {/* Enhanced CSS for Multi-layer Button Effects and Vector Animations */}
      <style jsx global>{`
        .hero-nav-button {
          position: relative;
          overflow: hidden;
        }
        
        .hero-nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(197, 61, 57, 0.1) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 50%;
        }
        
        .hero-nav-button:hover::before {
          opacity: 1;
        }
        
        .hero-nav-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(241, 186, 105, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }
        
        .hero-nav-button:hover::after {
          width: 100%;
          height: 100%;
        }

        /* Vector Animation Keyframes */
        @keyframes float-rotate {
          0%, 100% { 
            transform: translateY(0px) rotate(45deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(90deg); 
          }
        }

        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-15px) scale(1.05); 
          }
        }

        @keyframes rotate-slow {
          from { 
            transform: rotate(0deg); 
          }
          to { 
            transform: rotate(360deg); 
          }
        }

        @keyframes rotate-reverse {
          from { 
            transform: rotate(360deg); 
          }
          to { 
            transform: rotate(0deg); 
          }
        }

        @keyframes pulse-rotate {
          0%, 100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 0.15; 
          }
          50% { 
            transform: scale(1.1) rotate(180deg); 
            opacity: 0.3; 
          }
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(45deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(60deg); 
          }
        }

        @keyframes float-bounce {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-25px) scale(1.1); 
          }
        }

        @keyframes float-sway {
          0%, 100% { 
            transform: translateX(0px) translateY(0px) rotate(30deg); 
          }
          50% { 
            transform: translateX(10px) translateY(-15px) rotate(45deg); 
          }
        }

        @keyframes float-dot {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(-12px); 
            opacity: 0.6; 
          }
        }

        @keyframes float-dot-delayed {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.25; 
          }
          50% { 
            transform: translateY(-8px); 
            opacity: 0.5; 
          }
        }

        @keyframes float-dot-slow {
          0%, 100% { 
            transform: translateY(0px); 
            opacity: 0.2; 
          }
          50% { 
            transform: translateY(-6px); 
            opacity: 0.4; 
          }
        }

        /* Animation Classes */
        .animate-float-rotate { 
          animation: float-rotate 8s ease-in-out infinite; 
        }

        .animate-float-gentle { 
          animation: float-gentle 6s ease-in-out infinite 1s; 
        }

        .animate-rotate-slow { 
          animation: rotate-slow 20s linear infinite; 
        }

        .animate-rotate-reverse { 
          animation: rotate-reverse 15s linear infinite; 
        }

        .animate-pulse-rotate { 
          animation: pulse-rotate 10s ease-in-out infinite; 
        }

        .animate-float-slow { 
          animation: float-slow 7s ease-in-out infinite 2s; 
        }

        .animate-float-bounce { 
          animation: float-bounce 5s ease-in-out infinite 1.5s; 
        }

        .animate-float-sway { 
          animation: float-sway 9s ease-in-out infinite 3s; 
        }

        .animate-float-dot { 
          animation: float-dot 4s ease-in-out infinite; 
        }

        .animate-float-dot-delayed { 
          animation: float-dot-delayed 5s ease-in-out infinite 2s; 
        }

        .animate-float-dot-slow { 
          animation: float-dot-slow 6s ease-in-out infinite 1s; 
        }
      `}</style>
    </section>
  )
}
