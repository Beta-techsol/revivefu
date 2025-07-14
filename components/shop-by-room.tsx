"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Eye, RotateCcw, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookOpen, Gamepad2, Bed, Home } from "lucide-react"
import { QuickViewModal } from "./quick-view-modal"

interface Product {
  id: string
  name: string
  price: number
  maxPrice?: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description: string
  rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  isHot?: boolean
}

interface RoomCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  productCount: number
  featuredImage: string
  products: Product[]
}

const roomCategories: RoomCategory[] = [
  {
    id: "study-room",
    name: "Study Room",
    icon: BookOpen,
    productCount: 12,
    featuredImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    products: [
      {
        id: "study-1",
        name: "Executive Office Desk",
        price: 899.0,
        maxPrice: 1199.0,
        originalPrice: 1199.0,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
        description: "Premium executive office desk with modern design and ample storage space",
        rating: 4.8,
        isOnSale: true,
        discount: 25,
      },
      {
        id: "study-2",
        name: "Ergonomic Study Chair",
        price: 449.0,
        image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
        description: "Comfortable ergonomic chair perfect for long study sessions",
        rating: 4.7,
        isHot: true,
      },
      {
        id: "study-3",
        name: "Wooden Bookshelf",
        price: 329.0,
        image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        description: "Spacious wooden bookshelf with adjustable shelves",
        rating: 4.6,
      },
      {
        id: "study-4",
        name: "Study Lamp",
        price: 89.0,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
        description: "Modern LED study lamp with adjustable brightness",
        rating: 4.5,
      },
      {
        id: "study-5",
        name: "Storage Cabinet",
        price: 549.0,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
        description: "Multi-purpose storage cabinet for office organization",
        rating: 4.4,
      },
      {
        id: "study-6",
        name: "Office Organizer",
        price: 199.0,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
        description: "Desktop organizer to keep your workspace tidy",
        rating: 4.3,
      },
    ],
  },
  {
    id: "gaming-room",
    name: "Gaming Room",
    icon: Gamepad2,
    productCount: 10,
    featuredImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
    products: [
      {
        id: "gaming-1",
        name: "Gaming Desk Pro",
        price: 699.0,
        maxPrice: 899.0,
        originalPrice: 899.0,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1631933934798-6f99a6642240?w=400&h=400&fit=crop",
        description: "Professional gaming desk with RGB lighting and cable management",
        rating: 4.9,
        isOnSale: true,
        discount: 22,
      },
      {
        id: "gaming-2",
        name: "RGB Gaming Chair",
        price: 599.0,
        image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?w=400&h=400&fit=crop",
        description: "Gaming chair with RGB lighting and premium comfort",
        rating: 4.8,
        isHot: true,
      },
      {
        id: "gaming-3",
        name: "Monitor Stand",
        price: 149.0,
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1519710164239-da1231503ef4?w=400&h=400&fit=crop",
        description: "Adjustable monitor stand for optimal viewing angle",
        rating: 4.5,
      },
      {
        id: "gaming-4",
        name: "Cable Management Tray",
        price: 79.0,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1631933934798-6f99a6642240?w=400&h=400&fit=crop",
        description: "Keep your gaming setup organized with this cable tray",
        rating: 4.4,
      },
      {
        id: "gaming-5",
        name: "Gaming Storage Unit",
        price: 399.0,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1551802585-14196541b620?w=400&h=400&fit=crop",
        description: "Storage unit designed specifically for gaming accessories",
        rating: 4.6,
      },
      {
        id: "gaming-6",
        name: "Gaming Headset Stand",
        price: 89.0,
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1631933934798-6f99a6642240?w=400&h=400&fit=crop",
        description: "Premium headset stand with RGB lighting",
        rating: 4.3,
      },
    ],
  },
  {
    id: "bed-room",
    name: "Bed Room",
    icon: Bed,
    productCount: 15,
    featuredImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    products: [
      {
        id: "bed-1",
        name: "Gwyneth Velvet King Bed",
        price: 1200.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Luxurious velvet king bed with premium upholstery",
        rating: 4.9,
      },
      {
        id: "bed-2",
        name: "Upholstered Bed",
        price: 1200.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Comfortable upholstered bed with modern design",
        rating: 4.8,
        isHot: true,
      },
      {
        id: "bed-3",
        name: "Montana King Bed",
        price: 1000.0,
        maxPrice: 1500.0,
        originalPrice: 1500.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Rustic Montana style king bed with solid wood frame",
        rating: 4.7,
        isOnSale: true,
        discount: 33,
      },
      {
        id: "bed-4",
        name: "Jervis Single Bed",
        price: 1100.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Compact single bed perfect for smaller spaces",
        rating: 4.6,
      },
      {
        id: "bed-5",
        name: "Storage Bed Frame",
        price: 1200.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Bed frame with built-in storage compartments",
        rating: 4.5,
      },
      {
        id: "bed-6",
        name: "Platform Bed",
        price: 899.0,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Minimalist platform bed with clean lines",
        rating: 4.4,
      },
    ],
  },
  {
    id: "home-decor",
    name: "Home Decor",
    icon: Home,
    productCount: 20,
    featuredImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    products: [
      {
        id: "decor-1",
        name: "Modern Wall Art",
        price: 199.0,
        maxPrice: 299.0,
        originalPrice: 299.0,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1551802585-14196541b620?w=400&h=400&fit=crop",
        description: "Contemporary wall art to enhance your living space",
        rating: 4.6,
        isOnSale: true,
        discount: 33,
      },
      {
        id: "decor-2",
        name: "Decorative Vase",
        price: 89.0,
        image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1519710164239-da1231503ef4?w=400&h=400&fit=crop",
        description: "Elegant decorative vase for your home decor",
        rating: 4.5,
        isHot: true,
      },
      {
        id: "decor-3",
        name: "Table Lamp",
        price: 129.0,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1588894487146-a9ca1a6904ca?w=400&h=400&fit=crop",
        description: "Stylish table lamp with warm ambient lighting",
        rating: 4.4,
      },
      {
        id: "decor-4",
        name: "Throw Pillows Set",
        price: 59.0,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1611645158537-184b690c9a12?w=400&h=400&fit=crop",
        description: "Comfortable throw pillows to complement your sofa",
        rating: 4.3,
      },
      {
        id: "decor-5",
        name: "Mirror Frame",
        price: 249.0,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1551802585-14196541b620?w=400&h=400&fit=crop",
        description: "Decorative mirror frame to brighten your space",
        rating: 4.7,
      },
      {
        id: "decor-6",
        name: "Decorative Bowl",
        price: 79.0,
        image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=300&h=300&fit=crop",
        hoverImage: "https://images.unsplash.com/photo-1519710164239-da1231503ef4?w=400&h=400&fit=crop",
        description: "Beautiful decorative bowl for your dining table",
        rating: 4.2,
      },
    ],
  },
]

export function ShopByRoom() {
  const [activeCategory, setActiveCategory] = useState("study-room")
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const productsPerView = 5

  const activeRoom = roomCategories.find((room) => room.id === activeCategory) || roomCategories[0]
  const maxProductIndex = Math.max(0, activeRoom.products.length - productsPerView)

  // Intersection observer for entrance animation
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

  const nextProducts = () => {
    setCurrentProductIndex((prev) => Math.min(prev + 1, maxProductIndex))
  }

  const prevProducts = () => {
    setCurrentProductIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const closeQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  // Reset product index when category changes
  useEffect(() => {
    setCurrentProductIndex(0)
  }, [activeCategory])

  return (
    <section ref={sectionRef} className="py-8 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-[#C53D39]/5 to-[#F1BA69]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-[#F1BA69]/5 to-[#C53D39]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header with Animation */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] bg-clip-text text-transparent">Room</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect furniture for every space in your home
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Layout with Animation */}
          <div
            className={`grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Left Sidebar - Category Tabs */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                {roomCategories.map((category, index) => {
                  const IconComponent = category.icon
                  const isActive = activeCategory === category.id

                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-lg text-left transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg transform scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-100 hover:transform hover:scale-102"
                      }`}
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <IconComponent className="h-6 w-6" />
                      <div>
                        <div className="font-semibold text-sm tracking-wide">{category.name}</div>
                        <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-500"}`}>
                          {category.productCount} Products
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Side - Featured Image */}
            <div className="lg:col-span-3">
              <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-gray-200 shadow-lg">
                <Image
                  src={activeRoom.featuredImage || "/placeholder.svg"}
                  alt={`${activeRoom.name} room`}
                  fill
                  className="object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                {/* Room Category Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                    {activeRoom.name.toUpperCase()}
                  </span>
                </div>

                {/* Product Count Badge */}
                <div className="absolute bottom-6 right-6">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                    {activeRoom.productCount} Products Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section with Animation */}
          <div
            className={`space-y-6 relative transition-all duration-1000 delay-600 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Products Grid */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentProductIndex * (100 / productsPerView)}%)`,
                }}
              >
                {activeRoom.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 px-3"
                    style={{
                      width: `${100 / productsPerView}%`,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Clean Product Card */}
                    <div
                      className="group relative transition-all duration-300 transform hover:scale-105"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => {
                        setHoveredProduct(null)
                        setHoveredIcon(null)
                      }}
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md">
                        <Image
                          src={hoveredProduct === product.id && product.hoverImage ? product.hoverImage : product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-all duration-300"
                        />

                        {/* Sale/Hot Badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                          {product.isOnSale && product.discount && (
                            <span className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white px-2 py-1 text-xs font-medium rounded-full">
                              -{product.discount}%
                            </span>
                          )}
                          {product.isHot && (
                            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                              HOT
                            </span>
                          )}
                        </div>

                        {/* Hover Overlay - All Icons on Right Side */}
                        {hoveredProduct === product.id && (
                          <div className="absolute inset-0 z-20">
                            {/* All Action Icons - Right Side Vertically */}
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3">
                              {/* Quick View Icon */}
                              <div className="relative">
                                <button
                                  onClick={() => handleQuickView(product)}
                                  onMouseEnter={() => setHoveredIcon("quickview")}
                                  onMouseLeave={() => setHoveredIcon(null)}
                                  className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                                    hoveredIcon === "quickview"
                                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                      : "bg-white text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>

                                {/* Expanding Button - Fixed width and positioning */}
                                {hoveredIcon === "quickview" && (
                                  <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                    <span>Quick View</span>
                                  </div>
                                )}
                              </div>

                              {/* Compare Icon */}
                              <div
                                className="relative"
                                onMouseEnter={() => setHoveredIcon("compare")}
                                onMouseLeave={() => setHoveredIcon(null)}
                              >
                                {/* Static Icon with gradient background on hover */}
                                <button
                                  className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                    hoveredIcon === "compare"
                                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                      : "bg-white text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>

                                {/* Expanding Button - Wider */}
                                {hoveredIcon === "compare" && (
                                  <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                    <span>Compare</span>
                                  </div>
                                )}
                              </div>

                              {/* Wishlist Icon */}
                              <div
                                className="relative"
                                onMouseEnter={() => setHoveredIcon("wishlist")}
                                onMouseLeave={() => setHoveredIcon(null)}
                              >
                                {/* Static Icon with gradient background on hover */}
                                <button
                                  className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                    hoveredIcon === "wishlist"
                                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                      : "bg-white text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <Heart className="h-4 w-4" />
                                </button>

                                {/* Expanding Button - Wider */}
                                {hoveredIcon === "wishlist" && (
                                  <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                    <span>Wishlist</span>
                                  </div>
                                )}
                              </div>

                              {/* Cart Icon */}
                              <div
                                className="relative"
                                onMouseEnter={() => setHoveredIcon("cart")}
                                onMouseLeave={() => setHoveredIcon(null)}
                              >
                                {/* Static Icon with gradient background on hover */}
                                <button
                                  className={`w-10 h-10 rounded border border-gray-200 flex items-center justify-center transition-all duration-200 relative z-30 ${
                                    hoveredIcon === "cart"
                                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white border-transparent"
                                      : "bg-white text-gray-600 hover:bg-gray-50"
                                  }`}
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </button>

                                {/* Expanding Button - Wider */}
                                {hoveredIcon === "cart" && (
                                  <div className="absolute top-0 right-8 bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white rounded flex items-center justify-center text-sm font-medium z-20 h-10 px-4 whitespace-nowrap">
                                    <span>Add to Cart</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Info - Clean and Simple */}
                      <div className="text-center space-y-2">
                        <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                        <div className="text-gray-900 font-semibold">
                          {product.maxPrice ? (
                            <span>
                              ${product.price.toFixed(2)} - ${product.maxPrice.toFixed(2)}
                            </span>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <span>${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Bottom Right Corner */}
            <div className="absolute bottom-0 right-0 flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={prevProducts}
                disabled={currentProductIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12 rounded-full bg-white shadow-lg border-2 hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#F1BA69] hover:text-white hover:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={nextProducts}
                disabled={currentProductIndex === maxProductIndex}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center space-x-2 pt-16">
              {Array.from({ length: maxProductIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProductIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentProductIndex
                      ? "bg-gradient-to-r from-[#C53D39] to-[#F1BA69] w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} isOpen={isQuickViewOpen} onClose={closeQuickView} />
    </section>
  )
}
