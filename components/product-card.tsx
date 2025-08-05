"use client"
import { useCart } from "@/hooks/use-cart"
import { useCompare } from "@/hooks/use-compare"
import { useWishlist } from "@/hooks/use-wishlist"
import { Heart, Eye, ShoppingBag, Star, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

// Add custom styles for flip animation
const flipStyles = `
.perspective-1000 {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.backface-hidden {
  backface-visibility: hidden;
}
.rotate-x-180 {
  transform: rotateX(180deg);
}
.flip-button:hover {
  transform: rotateX(180deg);
}
`

// Inject styles
if (typeof document !== "undefined" && !document.getElementById("flip-button-styles")) {
  const style = document.createElement("style")
  style.id = "flip-button-styles"
  style.textContent = flipStyles
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
      <div className="relative aspect-square overflow-hidden bg-gray-50">
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
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
            </button>
            {/* Tooltip */}
            {hoveredAction === "wishlist" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
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
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            {/* Tooltip */}
            {hoveredAction === "compare" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
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
              className="w-10 h-10 rounded-full bg-white text-gray-700 hover:bg-black hover:text-white shadow-md flex items-center justify-center transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
            {/* Tooltip */}
            {hoveredAction === "quickview" && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                Quick View
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="relative">
            <button
              onClick={handleAddToCart}
              onMouseEnter={() => setHoveredAction("cart")}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={product.isSoldOut}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                product.isSoldOut
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800 shadow-md"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
            {/* Tooltip */}
            {hoveredAction === "cart" && !product.isSoldOut && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-20">
                Add to Cart
                <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product info */}
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
