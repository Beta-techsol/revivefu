"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { QuickViewModal } from "./quick-view-modal"
import { ChevronLeft, ChevronRight, Flame, Clock, TrendingUp, Star } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
}

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: Tab[] = [
  { id: "deals", label: "Deal of the Day", icon: Flame },
  { id: "latest", label: "Latest Furniture", icon: Clock },
  { id: "trending", label: "Trending Furniture", icon: TrendingUp },
  { id: "hot", label: "Hot Selling", icon: Star },
]

const productData = {
  deals: [
    {
      id: "deal-1",
      name: "Premium Leather Sofa",
      price: 1899.99,
      originalPrice: 2499.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Luxurious leather sofa with premium comfort",
      rating: 4.9,
      isOnSale: true,
      discount: 24,
    },
    {
      id: "deal-2",
      name: "Executive Desk Chair",
      price: 699.99,
      originalPrice: 999.99,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Ergonomic office chair with lumbar support",
      rating: 4.8,
      isOnSale: true,
      discount: 30,
    },
    {
      id: "deal-3",
      name: "Modern Coffee Table",
      price: 399.99,
      originalPrice: 599.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Sleek glass-top coffee table with storage",
      rating: 4.7,
      isOnSale: true,
      discount: 33,
    },
    {
      id: "deal-4",
      name: "Dining Table Set",
      price: 1299.99,
      originalPrice: 1799.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "6-seater dining set in oak finish",
      rating: 4.6,
      isOnSale: true,
      discount: 28,
    },
    {
      id: "deal-5",
      name: "Luxury Recliner",
      price: 1599.99,
      originalPrice: 2199.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Premium leather recliner with massage function",
      rating: 4.9,
      isOnSale: true,
      discount: 27,
    },
    {
      id: "deal-6",
      name: "King Size Bed",
      price: 1899.99,
      originalPrice: 2599.99,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      description: "Elegant king size bed with storage",
      rating: 4.8,
      isOnSale: true,
      discount: 27,
    },
    {
      id: "deal-7",
      name: "Office Desk",
      price: 899.99,
      originalPrice: 1299.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Modern office desk with drawers",
      rating: 4.7,
      isOnSale: true,
      discount: 31,
    },
    {
      id: "deal-8",
      name: "Wardrobe Cabinet",
      price: 1199.99,
      originalPrice: 1699.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      description: "Spacious wardrobe with mirror doors",
      rating: 4.6,
      isOnSale: true,
      discount: 29,
    },
    {
      id: "deal-9",
      name: "Bookshelf Unit",
      price: 549.99,
      originalPrice: 799.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "5-tier wooden bookshelf unit",
      rating: 4.5,
      isOnSale: true,
      discount: 31,
    },
    {
      id: "deal-10",
      name: "Accent Chair",
      price: 649.99,
      originalPrice: 899.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Stylish accent chair in velvet",
      rating: 4.7,
      isOnSale: true,
      discount: 28,
    },
  ],
  latest: [
    {
      id: "latest-1",
      name: "Scandinavian Armchair",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Modern Scandinavian design armchair",
      rating: 4.8,
    },
    {
      id: "latest-2",
      name: "Minimalist Bookshelf",
      price: 549.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Clean lines bookshelf with 5 tiers",
      rating: 4.7,
    },
    {
      id: "latest-3",
      name: "Platform Bed Frame",
      price: 999.99,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      description: "Low-profile platform bed in walnut",
      rating: 4.9,
    },
    {
      id: "latest-4",
      name: "Bar Stool Set",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Set of 2 adjustable bar stools",
      rating: 4.5,
    },
    {
      id: "latest-5",
      name: "Modern Sofa",
      price: 1899.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      description: "Contemporary 3-seater sofa",
      rating: 4.8,
    },
    {
      id: "latest-6",
      name: "Glass Dining Table",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Modern glass dining table for 6",
      rating: 4.6,
    },
    {
      id: "latest-7",
      name: "Storage Ottoman",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Multi-functional storage ottoman",
      rating: 4.4,
    },
    {
      id: "latest-8",
      name: "TV Stand",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Modern TV stand with storage",
      rating: 4.5,
    },
    {
      id: "latest-9",
      name: "Nightstand Set",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      description: "Set of 2 matching nightstands",
      rating: 4.6,
    },
    {
      id: "latest-10",
      name: "Floor Lamp",
      price: 149.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Modern adjustable floor lamp",
      rating: 4.3,
    },
  ],
  trending: [
    {
      id: "trending-1",
      name: "Velvet Accent Chair",
      price: 649.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Luxurious velvet accent chair in emerald",
      rating: 4.8,
    },
    {
      id: "trending-2",
      name: "Industrial Desk",
      price: 899.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Industrial style desk with metal frame",
      rating: 4.7,
    },
    {
      id: "trending-3",
      name: "Ottoman Storage",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      description: "Multi-functional ottoman with storage",
      rating: 4.6,
    },
    {
      id: "trending-4",
      name: "Console Table",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Narrow console table for entryways",
      rating: 4.5,
    },
    {
      id: "trending-5",
      name: "Sectional Sofa",
      price: 2299.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      description: "Large L-shaped sectional sofa",
      rating: 4.9,
    },
    {
      id: "trending-6",
      name: "Marble Coffee Table",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Elegant marble top coffee table",
      rating: 4.7,
    },
    {
      id: "trending-7",
      name: "Swivel Chair",
      price: 549.99,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      description: "Modern swivel office chair",
      rating: 4.6,
    },
    {
      id: "trending-8",
      name: "Dining Chairs Set",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Set of 4 upholstered dining chairs",
      rating: 4.5,
    },
    {
      id: "trending-9",
      name: "Storage Bench",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Upholstered storage bench",
      rating: 4.4,
    },
    {
      id: "trending-10",
      name: "Side Table",
      price: 179.99,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      description: "Round wooden side table",
      rating: 4.3,
    },
  ],
  hot: [
    {
      id: "hot-1",
      name: "Gaming Chair Pro",
      price: 1199.99,
      originalPrice: 1499.99,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Professional gaming chair with RGB lighting",
      rating: 4.9,
      isOnSale: true,
      discount: 20,
    },
    {
      id: "hot-2",
      name: "L-Shaped Sectional",
      price: 2199.99,
      originalPrice: 2799.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Large L-shaped sectional sofa",
      rating: 4.8,
      isOnSale: true,
      discount: 21,
    },
    {
      id: "hot-3",
      name: "Standing Desk",
      price: 799.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Electric height-adjustable standing desk",
      rating: 4.7,
    },
    {
      id: "hot-4",
      name: "Memory Foam Mattress",
      price: 899.99,
      originalPrice: 1199.99,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
      description: "Queen size memory foam mattress",
      rating: 4.9,
      isOnSale: true,
      discount: 25,
    },
    {
      id: "hot-5",
      name: "Executive Chair",
      price: 999.99,
      originalPrice: 1299.99,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      description: "High-back executive office chair",
      rating: 4.8,
      isOnSale: true,
      discount: 23,
    },
    {
      id: "hot-6",
      name: "Modular Sofa",
      price: 1799.99,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      description: "Customizable modular sofa system",
      rating: 4.7,
    },
    {
      id: "hot-7",
      name: "Adjustable Desk",
      price: 649.99,
      originalPrice: 899.99,
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
      description: "Height adjustable computer desk",
      rating: 4.6,
      isOnSale: true,
      discount: 28,
    },
    {
      id: "hot-8",
      name: "Luxury Armchair",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      description: "Premium leather luxury armchair",
      rating: 4.9,
    },
    {
      id: "hot-9",
      name: "Storage Cabinet",
      price: 749.99,
      originalPrice: 999.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      description: "Multi-purpose storage cabinet",
      rating: 4.5,
      isOnSale: true,
      discount: 25,
    },
    {
      id: "hot-10",
      name: "Ergonomic Chair",
      price: 599.99,
      originalPrice: 799.99,
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
      description: "Ergonomic mesh office chair",
      rating: 4.6,
      isOnSale: true,
      discount: 25,
    },
  ],
}

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("deals")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
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

  // Reset carousel index when tab changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [activeTab])

  const currentProducts = productData[activeTab as keyof typeof productData]

  // Number of products to show per view (responsive)
  const getProductsPerView = () => {
    if (typeof window === "undefined") return 4
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 768) return 2
    if (window.innerWidth < 1024) return 3
    return 4
  }

  const [productsPerView, setProductsPerView] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      setProductsPerView(getProductsPerView())
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, currentProducts.length - productsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-white transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 transform ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white scale-105 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                } ${isVisible ? `animate-fade-in-up` : "opacity-0"}`}
                style={{
                  animationDelay: isVisible ? `${index * 100}ms` : "0ms",
                }}
              >
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeTab === tab.id ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Product Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] shadow-lg transition-all duration-300 group"
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
          </Button>

          {/* Products Container */}
          <div className="overflow-hidden mx-12">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / productsPerView)}%)`,
              }}
            >
              {currentProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 px-3" style={{ width: `${100 / productsPerView}%` }}>
                  <ProductCard product={product} onQuickView={handleQuickView} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick View Modal */}
        <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
