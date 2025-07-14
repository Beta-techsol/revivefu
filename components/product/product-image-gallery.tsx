"use client"

import { useState } from "react"
import Image from "next/image"
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
  const [selectedImage, setSelectedImage] = useState(0)
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0)
  const visibleThumbnails = 4

  const scrollThumbnails = (direction: "up" | "down") => {
    if (direction === "up" && thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1)
    } else if (direction === "down" && thumbnailStartIndex < images.length - visibleThumbnails) {
      setThumbnailStartIndex(thumbnailStartIndex + 1)
    }
  }

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
          {images.slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails).map((image, index) => {
            const actualIndex = thumbnailStartIndex + index
            return (
              <button
                key={actualIndex}
                onClick={() => setSelectedImage(actualIndex)}
                className={cn(
                  "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300",
                  selectedImage === actualIndex
                    ? "border-[#C53D39] shadow-lg"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} view ${actualIndex + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scrollThumbnails("down")}
          disabled={thumbnailStartIndex >= images.length - visibleThumbnails}
          className="mt-2 h-8 w-8"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Image */}
      <div className="relative flex-1">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt={productName}
            fill
            className="object-cover"
            priority
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
