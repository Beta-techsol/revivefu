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

        .category-badge:hover::before {
          left: 100%;
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

        @media (max-width: 768px) {
          .hero-content {
            text-align: center;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .hero-indicators {
            justify-content: center;
          }
        }
      `}</style>

      <section ref={heroRef} className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Images */}
        {featuredProducts.map((product, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39]/20 to-[#F1BA69]/20" />

        {/* Vertical Shop Now Button - Left Side */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
          <Link href={currentProduct.productUrl}>
            <div
              className="group relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #C53D39 0%, #F1BA69 100%)",
                padding: "40px 20px",
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px",
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                boxShadow: "0 8px 32px rgba(197, 61, 57, 0.3)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(5px) scale(1.05)"
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(197, 61, 57, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0px) scale(1)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(197, 61, 57, 0.3)"
              }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-y-12 -translate-y-full group-hover:translate-y-full delay-200"></div>

              <span className="relative z-10 text-white font-semibold text-lg tracking-wider">Shop Now</span>
            </div>
          </Link>
        </div>

        {/* Category Badge - Top Right Corner */}
        <div className="absolute top-4 right-4 z-20">
          <div
            className="category-badge group"
            style={{
              background: "linear-gradient(135deg, #C53D39 0%, #F1BA69 100%)",
              color: "white",
              padding: "8px 16px md:padding-12px 24px",
              borderRadius: "50px",
              fontSize: "12px md:text-sm",
              fontWeight: "600",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              boxShadow: "0 8px 32px rgba(197, 61, 57, 0.3)",
              transition: "all 0.3s ease",
              transform: "translateY(0px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(197, 61, 57, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px) scale(1)"
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(197, 61, 57, 0.3)"
            }}
          >
            {currentProduct.category}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 lg:px-24">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white font-montserrat leading-tight mb-4">
              <span className="block dancing-script" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {currentProduct.name.split(" ")[0]}
              </span>
              <span className="block bg-gradient-to-r from-[#F1BA69] to-white bg-clip-text text-transparent">
                {currentProduct.name.split(" ").slice(1).join(" ")}
              </span>
            </h1>

            {/* Description */}
            <p className="text-white/80 text-sm md:text-base lg:text-lg mb-6 max-w-lg leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F1BA69]">
                PKR {currentProduct.price.toLocaleString()}
              </span>
              {currentProduct.originalPrice && (
                <span className="text-lg md:text-xl text-white/60 line-through">
                  PKR {currentProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Mobile Shop Now Button */}
            <div className="lg:hidden mb-6">
              <Link href={currentProduct.productUrl}>
                <Button
                  size="lg"
                  className="group text-base px-8 py-4 font-semibold relative overflow-hidden w-full sm:w-auto"
                  style={{
                    background: "linear-gradient(135deg, #C53D39 0%, #F1BA69 100%)",
                    border: "none",
                  }}
                >
                  {/* Multi-layer fill effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-[#F1BA69] to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-600 ease-out delay-100"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C53D39] via-[#E67E22] to-[#F1BA69] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out delay-200 origin-center"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full delay-500"></div>

                  <span className="relative z-10">Shop Now</span>
                  <span className="group-hover:translate-x-1 transition-transform ml-2 relative z-10">→</span>
                </Button>
              </Link>
            </div>

            {/* Product indicators */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "w-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69]"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-white/60">
                {currentSlide + 1} / {featuredProducts.length}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows - Positioned outside content area */}
        <button
          onClick={prevSlide}
          className="hero-nav-button group absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#C53D39] transition-all duration-300 overflow-hidden rounded-full flex items-center justify-center z-30"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronLeft className="h-6 w-6 relative z-10" />
        </button>

        <button
          onClick={nextSlide}
          className="hero-nav-button group absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-[#C53D39] transition-all duration-300 overflow-hidden rounded-full flex items-center justify-center z-30"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <ChevronRight className="h-6 w-6 relative z-10" />
        </button>

        {/* Dots Indicator - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  )
}
