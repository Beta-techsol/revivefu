"use client"

import { useState } from "react"
import SmartImage from "@/components/smart-image"
import { Heart, RotateCcw, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  onWishlistToggle?: () => void
  isWishlisted?: boolean
  on360ViewClick?: () => void
}

export default function ProductImageGallery({
  images,
  productName,
  onWishlistToggle,
  isWishlisted = false,
  on360ViewClick,
}: ProductImageGalleryProps) {
  const safeImages = images && images.length > 0 ? images : ["/placeholder.svg"]
  const [selectedImage, setSelectedImage] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({})
  const visibleThumbnails = 4

  const handleImageError = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }))
  }

  const getSrc = (index: number) => {
    if (failedIndices[index]) return "/placeholder.svg"
    return safeImages[index] || "/placeholder.svg"
  }

  const scrollThumbnails = (direction: "up" | "down") => {
    if (direction === "up" && thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1)
    } else if (direction === "down" && thumbnailStartIndex < safeImages.length - visibleThumbnails) {
      setThumbnailStartIndex(thumbnailStartIndex + 1)
    }
  }

  const activeIndex = selectedImage < safeImages.length ? selectedImage : 0

  return (
    <div className="flex gap-4">
      {/* Thumbnail Carousel */}
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollThumbnails("up")}
          disabled={thumbnailStartIndex === 0}
          className="mb-2 h-8 w-8"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <div className="flex flex-col gap-2 h-96 overflow-hidden">
          {safeImages.slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails).map((_, index) => {
            const actualIndex = thumbnailStartIndex + index
            return (
              <button
                key={actualIndex}
                onClick={() => setSelectedImage(actualIndex)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                  activeIndex === actualIndex
                    ? "border-[#C53D39] shadow-lg"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <SmartImage
                  src={getSrc(actualIndex)}
                  alt={`${productName} view ${actualIndex + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={() => handleImageError(actualIndex)}
                />
              </button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollThumbnails("down")}
          disabled={safeImages.length <= visibleThumbnails || thumbnailStartIndex >= safeImages.length - visibleThumbnails}
          className="mt-2 h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Image */}
      <div className="relative flex-1">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
          <SmartImage
            src={getSrc(activeIndex)}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
            onError={() => handleImageError(activeIndex)}
          />

          {/* Wishlist Button */}
          <button
            onClick={onWishlistToggle}
            className={cn(
              "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
              isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:text-red-500",
            )}
          >
            <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
          </button>

          {/* 360° View Button */}
          <button
            onClick={on360ViewClick}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white transition-all duration-300 shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">360° View</span>
          </button>
        </div>
      </div>
    </div>
  )
}
