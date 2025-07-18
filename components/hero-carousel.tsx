"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  category: string
  productUrl: string
}

const featuredProducts: Product[] = [
  {
    id: "325",
    name: "Luxury Bedroom Set",
    price: 299999,
    originalPrice: 349999,
    image: "/products/luxury-bedroom-set.webp",
    description:
      "Exquisite bedroom furniture with golden accents, tufted headboard, and matching dresser for ultimate luxury",
    category: "Bedroom",
    productUrl: "/product/325",
  },
  {
    id: "271",
    name: "Modern Dining Chair",
    price: 24999,
    originalPrice: 29999,
    image: "/products/modern-dining-chair.webp",
    description: "Contemporary quilted leather chair with ergonomic design and sleek black metal legs",
    category: "Dining Room",
    productUrl: "/product/271",
  },
  {
    id: "331",
    name: "Executive Office Desk",
    price: 89999,
    originalPrice: 109999,
    image: "/products/executive-office-desk.webp",
    description: "Premium workspace solution with wood-grain finish and modern white metal frame",
    category: "Office",
    productUrl: "/product/331",
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
      if (hasAnimated[currentSlide] || !heroRef.current || !productImageRef.current) return

      const scrollY = window.scrollY
      const heroHeight = heroRef.current.offsetHeight

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

      const targetImageContainer = targetElement.querySelector(".aspect-square")
      if (!targetImageContainer) return

      const imageRect = productImageElement.getBoundingClientRect()

      const floatingImage = document.createElement("div")
      floatingImage.style.cssText = `
        position: fixed;
        left: ${imageRect.left}px;
        top: ${imageRect.top}px;
        width: ${imageRect.width}px;
        height: ${imageRect.height}px;
        z-index: 1000;
        border-radius: 16px;
        overflow: hidden;
        opacity: 1;
        transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        transform: scale(1) rotate(0deg);
        pointer-events: none;
      `

      floatingImage.innerHTML = `
        <img src="${currentProduct.image}" alt="${currentProduct.name}" 
             style="width: 100%; height: 100%; object-fit: cover; opacity: 1; border-radius: 16px;" />
      `

      document.body.appendChild(floatingImage)

      productImageElement.style.opacity = "0.4"
      productImageElement.style.transition = "opacity 0.3s ease"

      setTimeout(() => {
        const newTargetRect = targetImageContainer.getBoundingClientRect()

        const finalLeft = newTargetRect.left
        const finalTop = newTargetRect.top
        const finalWidth = newTargetRect.width
        const finalHeight = newTargetRect.height

        floatingImage.style.cssText += `
          left: ${finalLeft}px;
          top: ${finalTop}px;
          width: ${finalWidth}px;
          height: ${finalHeight}px;
          transform: scale(0.98) rotate(-1deg);
          opacity: 1;
          border-radius: 12px;
        `
      }, 200)

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

      setTimeout(() => {
        floatingImage.style.opacity = "0"
        floatingImage.style.transform = "scale(1.02)"
      }, 2300)

      setTimeout(() => {
        if (document.body.contains(floatingImage)) {
          document.body.removeChild(floatingImage)
        }
        productImageElement.style.opacity = "1"
      }, 2800)

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
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
        
        .dancing-script {
          font-family: 'Dancing Script', cursive;
        }
        
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

        .category-badge {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          background: linear-gradient(135deg, #C53D39 0%, #F1BA69 100%);
          border: none;
          color: white;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px 0 rgba(197, 61, 57, 0.25);
        }

        .category-badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .category-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px 0 rgba(197, 61, 57, 0.35);
        }

        .category-badge:hover::before {
          left: 100%;
        }

        .category-badge:active {
          transform: translateY(0px);
          box-shadow: 0 4px 14px 0 rgba(197, 61, 57, 0.25);
        }

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

      <section
        ref={heroRef}
        className="relative h-[600px] bg-gradient-to-br from-gray-50 via-white to-[#F1BA69]/5 overflow-hidden"
      >
        {/* Category Badge - Left Corner, Full Height */}
        <div className="absolute left-0 top-0 h-full flex items-center z-20">
          <button
            className="category-badge h-16 px-6 rounded-r-full text-sm font-semibold tracking-wider"
            style={{
              writingMode: "horizontal-tb",
              minWidth: "120px",
            }}
          >
            {currentProduct.category}
          </button>
        </div>

        {/* Background decoration with rotating and floating vectors */}
        <div className="absolute inset-0">
          {/* Original gradient backgrounds */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-[#C53D39]/10 to-[#F1BA69]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#F1BA69]/10 to-[#C53D39]/10 rounded-full blur-3xl"></div>

          {/* Rotating and floating vectors - Hidden on mobile for performance */}
          <div className="hidden md:block">
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
          </div>

          {/* SVG vectors with rotation - Hidden on mobile */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            viewBox="0 0 1200 800"
          >
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
              <circle
                cx="150"
                cy="600"
                r="20"
                stroke="url(#heroGradient1)"
                strokeWidth="1"
                fill="none"
                opacity="0.25"
              />
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

        <div className="container mx-auto px-4 relative z-10 h-full">
          <div className="h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full pl-0 lg:pl-32">
              {/* Left content */}
              <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="block text-black dancing-script">{currentProduct.name.split(" ")[0]}</span>
                    <span className="block bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">
                      {currentProduct.name.split(" ").slice(1).join(" ")}
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed mx-auto lg:mx-0">
                    {currentProduct.description}
                  </p>
                </div>

                <div className="flex items-baseline justify-center lg:justify-start space-x-4">
                  <span className="text-4xl sm:text-5xl font-bold text-[#C53D39]">
                    PKR {currentProduct.price.toLocaleString()}
                  </span>
                  {currentProduct.originalPrice && (
                    <span className="text-xl sm:text-2xl text-gray-400 line-through">
                      PKR {currentProduct.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href={currentProduct.productUrl}>
                    <Button
                      size="xl"
                      className="group text-lg px-8 py-4 font-normal relative overflow-hidden w-full sm:w-auto"
                    >
                      {/* Layer 1: Left Fill */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>

                      {/* Layer 2: Right Fill */}
                      <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100"></div>

                      {/* Layer 3: Center Convergence Fill */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center"></div>

                      {/* Shimmer Overlay - Final sparkle effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500"></div>

                      <span className="relative z-10">Shop Now</span>
                      <span className="group-hover:translate-x-1 transition-transform ml-2 relative z-10">→</span>
                    </Button>
                  </Link>
                  <Link href={currentProduct.productUrl}>
                    <Button
                      variant="outline"
                      size="xl"
                      className="bg-transparent text-lg px-8 py-4 font-normal relative overflow-hidden group w-full sm:w-auto"
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
                  </Link>
                </div>

                {/* Product indicators */}
                <div className="flex items-center justify-center lg:justify-start space-x-4 pt-8">
                  <div className="flex space-x-2">
                    {featuredProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-8"
                            : "bg-gray-300 hover:bg-gray-400 w-3"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentSlide + 1} / {featuredProducts.length}
                  </div>
                </div>
              </div>

              {/* Right content - Single Product Image with rounded corners */}
              <div className="relative order-1 lg:order-2">
                <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px]">
                  {/* Main product image with rounded corners */}
                  <div
                    ref={productImageRef}
                    className="relative w-full h-full overflow-hidden rounded-2xl transition-all duration-700 ease-out"
                  >
                    <Image
                      src={currentProduct.image || "/placeholder.svg"}
                      alt={currentProduct.name}
                      fill
                      className="object-cover rounded-2xl transition-all duration-700 ease-out"
                      priority
                    />
                  </div>

                  {/* Navigation arrows with Multi-layer fill effects */}
                  <button
                    onClick={prevSlide}
                    className="hero-nav-button group absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-900 border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden rounded-full flex items-center justify-center relative"
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
                    className="hero-nav-button group absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white text-gray-900 border border-[#C53D39] hover:text-white hover:border-transparent transition-all duration-700 overflow-hidden rounded-full flex items-center justify-center relative"
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

                  {/* Floating elements - Hidden on mobile */}
                  <div className="hidden sm:block">
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20 rounded-full"></div>
                    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#F1BA69]/20 to-[#C53D39]/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#C53D39] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-[#C53D39] to-[#F1BA69] rounded-full mt-2"></div>
          </div>
        </div>
      </section>
    </>
  )
}
