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

.animate-bounce-in {
  animation: bounceIn 0.6s ease-out;
}

.animate-slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out;
}

.animate-pulse-custom {
  animation: pulse 0.3s ease-in-out;
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

.animate-flip-in {
  animation: flipIn 0.4s ease-out;
}

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
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  description?: string
  rating?: number
  isOnSale?: boolean
  isSoldOut?: boolean
  discount?: number
  category?: string
  material?: string
  color?: string
  brand?: string
  reviews?: number
  inStock?: boolean
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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleWishlist = () => {
    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      inStock: product.inStock !== false,
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(wishlistItem)
    }
  }

  const handleCompare = () => {
    const compareItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category || "",
      material: product.material || "",
      color: product.color || "",
      brand: product.brand || "",
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      inStock: product.inStock !== false,
    }

    if (isInCompare(product.id)) {
      removeFromCompare(product.id)
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
      className="group relative bg-gray-50 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setHoveredAction(null)
      }}
      id={`product-${product.id}`}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-[7px]">
        <Link href={`/product/${product.id}`}>
          <Image
            src={isHovered && product.hoverImage ? product.hoverImage : product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-500 cursor-pointer"
          />
        </Link>

        {/* Discount Badge */}
        {product.isOnSale && product.discount && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-lime-400 text-black px-3 py-1 text-xs font-semibold rounded-full flex items-center">
              <span className="mr-1">⚡</span>-{product.discount}%
            </div>
          </div>
        )}

        {/* Sold Out Badge */}
        {product.isSoldOut && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gray-800 text-white px-3 py-1 text-xs font-medium rounded-full">Sold Out</div>
          </div>
        )}

        {/* Action Buttons - appear on hover */}
        <div
          className={`absolute top-4 right-4 flex flex-col space-y-3 transition-all duration-300 ${
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
                isInWishlist(product.id)
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-black hover:text-white shadow-md"
              } ${isHovered ? "animate-bounce-in stagger-1" : ""}`}
            >
              <Heart
                className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""} ${hoveredAction === "wishlist" ? "animate-wiggle" : ""}`}
              />
            </button>
            {/* Tooltip */}
            {hoveredAction === "wishlist" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20 animate-fade-in-up">
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            )}
          </div>

          {/* Compare Button */}
          <div className="relative">
            <button
              onClick={handleCompare}
              onMouseEnter={() => setHoveredAction("compare")}
              onMouseLeave={() => setHoveredAction(null)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isInCompare(product.id)
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-black hover:text-white shadow-md"
              } ${isHovered ? "animate-slide-in-right stagger-2" : ""}`}
            >
              <BarChart3 className={`h-4 w-4 ${hoveredAction === "compare" ? "animate-pulse-custom" : ""}`} />
            </button>
            {/* Tooltip */}
            {hoveredAction === "compare" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20 animate-fade-in-up">
                {isInCompare(product.id) ? "Remove from Compare" : "Compare"}
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            )}
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
            {/* Tooltip */}
            {hoveredAction === "quickview" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20 animate-fade-in-up">
                Quick View
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button - Bottom Right Corner */}
        <div
          className={`absolute bottom-4 right-4 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="relative">
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredAction("cart")}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={product.isSoldOut}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                product.isSoldOut
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 shadow-lg"
              } ${isHovered ? "animate-bounce-in stagger-4" : ""}`}
            >
              <ShoppingBag className={`h-5 w-5 ${hoveredAction === "cart" ? "animate-pulse-custom" : ""}`} />
            </button>
            {/* Tooltip */}
            {hoveredAction === "cart" && !product.isSoldOut && (
              <div className="absolute bottom-14 right-0 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20 animate-fade-in-up">
                Add to Cart
                <div className="absolute bottom-0 right-4 transform translate-y-1 w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product info with border radius */}
      <div className="p-4 bg-white">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < (product.rating || 0) ? "text-black fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews || 0})</span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">₨{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₨{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  )
}
