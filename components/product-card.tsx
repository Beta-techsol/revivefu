"use client"
import { useCart } from "@/hooks/use-cart"
import { useCompare } from "@/hooks/use-compare"
import { useWishlist } from "@/hooks/use-wishlist"
import { Heart, Eye, ShoppingBag, Star, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

// Add custom styles for animations
const animationStyles = `
@keyframes bounceIn {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
}
@keyframes slideInRight {
  0% { transform: translateX(20px) rotate(-90deg); opacity: 0; }
  100% { transform: translateX(0) rotate(0deg); opacity: 1; }
}
@keyframes fadeInUp {
  0% { transform: translateY(10px) scale(0.8); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
@keyframes wiggle {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
}
@keyframes flipIn {
  0% { transform: rotateY(-90deg); opacity: 0; }
  100% { transform: rotateY(0deg); opacity: 1; }
}
.animate-bounce-in { animation: bounceIn 0.6s ease-out; }
.animate-slide-in-right { animation: slideInRight 0.5s ease-out; }
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out; }
.animate-pulse-custom { animation: pulse 0.3s ease-in-out; }
.animate-wiggle { animation: wiggle 0.5s ease-in-out; }
.animate-flip-in { animation: flipIn 0.4s ease-out; }
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
`

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("product-card-animations")) {
  const style = document.createElement("style")
  style.id = "product-card-animations"
  style.textContent = animationStyles
  document.head.appendChild(style)
}

interface Product {
  slug: string
  name: string
  price: number
  compare_price?: number | null
  images: string[] | string
  description?: string
  average_rating?: number
  review_count?: number
  stock_quantity?: number
  category_name?: string
  material?: string
  color?: string
  brand?: string
}

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredAction, setHoveredAction] = useState<string | null>(null)

  // Normalize images
  let productImages: string[] = []
  if (Array.isArray(product.images)) {
    productImages = product.images
  } else if (typeof product.images === "string") {
    try {
      productImages = JSON.parse(product.images)
    } catch {
      productImages = [product.images]
    }
  }
  const mainImage = productImages[0] || "/placeholder.jpg"
  const hoverImage = productImages[1] || null

  const isOnSale = !!product.compare_price
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const isSoldOut = product.stock_quantity !== undefined && product.stock_quantity <= 0

  const handleAddToCart = () => {
    addToCart({
      id: product.slug,
      name: product.name,
      price: product.price,
      image: mainImage,
    })
  }

  const handleWishlist = () => {
    const wishlistItem = {
      id: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price || undefined,
      image: mainImage,
      inStock: !isSoldOut,
    }

    if (isInWishlist(product.slug)) {
      removeFromWishlist(product.slug)
    } else {
      addToWishlist(wishlistItem)
    }
  }

  const handleCompare = () => {
    const compareItem = {
      id: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price || undefined,
      image: mainImage,
      category: product.category_name || "",
      material: product.material || "",
      color: product.color || "",
      brand: product.brand || "",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      inStock: !isSoldOut,
    }

    if (isInCompare(product.slug)) {
      removeFromCompare(product.slug)
    } else {
      addToCompare(compareItem)
    }
  }

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product)
    }
  }

  return (
    <div
      className="group relative w-full bg-gray-50 transition-all duration-300 overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setHoveredAction(null)
      }}
      id={`product-${product.slug}`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-[7px] w-full">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={isHovered && hoverImage ? hoverImage : mainImage}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 cursor-pointer"
            sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Discount Badge */}
        {isOnSale && discount && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-lime-400 text-black px-3 py-1 text-xs font-semibold rounded-full flex items-center">
              <span className="mr-1">⚡</span>-{discount}%
            </div>
          </div>
        )}

        {/* Sold Out Badge */}
        {isSoldOut && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium rounded-full">Sold Out</div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col space-y-2 sm:space-y-3 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          {/* Wishlist Button */}
          <div className="relative">
            <button
              onClick={handleWishlist}
              onMouseEnter={() => setHoveredAction("wishlist")}
              onMouseLeave={() => setHoveredAction(null)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isInWishlist(product.slug)
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-black hover:text-white shadow-md"
              } ${isHovered ? "animate-bounce-in stagger-1" : ""}`}
            >
              <Heart
                className={`h-4 w-4 ${isInWishlist(product.slug) ? "fill-current" : ""} ${
                  hoveredAction === "wishlist" ? "animate-wiggle" : ""
                }`}
              />
            </button>
          </div>

          {/* Compare Button */}
          <div className="relative">
            <button
              onClick={handleCompare}
              onMouseEnter={() => setHoveredAction("compare")}
              onMouseLeave={() => setHoveredAction(null)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isInCompare(product.slug)
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-black hover:text-white shadow-md"
              } ${isHovered ? "animate-slide-in-right stagger-2" : ""}`}
            >
              <BarChart3 className={`h-4 w-4 ${hoveredAction === "compare" ? "animate-pulse-custom" : ""}`} />
            </button>
          </div>

          {/* Quick View Button */}
          <div className="relative">
            <button
              onClick={handleQuickView}
              onMouseEnter={() => setHoveredAction("quickview")}
              onMouseLeave={() => setHoveredAction(null)}
              className={`w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-black hover:text-white shadow-md flex items-center justify-center transition-all duration-200 ${
                isHovered ? "animate-flip-in stagger-3" : ""
              }`}
            >
              <Eye className={`h-4 w-4 ${hoveredAction === "quickview" ? "animate-wiggle" : ""}`} />
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <div
          className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
              isSoldOut
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 shadow-lg"
            } ${isHovered ? "animate-bounce-in stagger-4" : ""}`}
          >
            <ShoppingBag
              className={`h-4 w-4 sm:h-5 sm:w-5 ${hoveredAction === "cart" ? "animate-pulse-custom" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-2 sm:p-3 lg:p-4 bg-white">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < (product.average_rating || 0) ? "text-black fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.review_count || 0})</span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm sm:text-base leading-tight mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
            ₨{product.price.toLocaleString()}
          </span>
          {product.compare_price && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₨{product.compare_price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
