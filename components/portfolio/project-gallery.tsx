"use client"

import { useState } from "react"
import Image from "next/image"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Shield,
  Star,
  Crown,
  Gem,
  CheckCircle,
  Heart,
  Zap,
  Eye,
} from "lucide-react"

interface ProjectGalleryProps {
  images: string[]
  projectTitle: string
}

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Badge configurations with different positions and trust-building words
  const badgeConfigs = [
    { text: "PREMIUM", icon: Crown, position: "top-4 left-4", direction: "horizontal" },
    { text: "TRUSTED", icon: Shield, position: "top-4 right-4", direction: "vertical" },
    { text: "QUALITY", icon: Award, position: "bottom-4 left-4", direction: "vertical" },
    { text: "LUXURY", icon: Gem, position: "bottom-4 right-4", direction: "horizontal" },
    { text: "CERTIFIED", icon: CheckCircle, position: "top-4 left-1/2 -translate-x-1/2", direction: "horizontal" },
    { text: "CRAFTED", icon: Star, position: "bottom-4 left-1/2 -translate-x-1/2", direction: "vertical" },
    { text: "ELEGANT", icon: Heart, position: "top-1/2 -translate-y-1/2 left-4", direction: "vertical" },
    { text: "MODERN", icon: Zap, position: "top-1/2 -translate-y-1/2 right-4", direction: "vertical" },
  ]

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return

    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }

  if (!images || images.length === 0) return null

  return (
    <>
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-urbanist">Project Gallery</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the detailed craftsmanship and design elements of {projectTitle}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((image, index) => {
                const badgeConfig = badgeConfigs[index % badgeConfigs.length]
                const IconComponent = badgeConfig.icon

                return (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${projectTitle} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                    </div>

                    {/* View Icon in Center */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 z-20">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg">
                        <div className="bg-gradient-to-r from-[#C53D39] to-[#F1BA69] p-2 rounded-full">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Trust Badge with Different Positions */}
                    <div
                      className={`absolute ${badgeConfig.position} opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100 z-10`}
                    >
                      <div
                        className={`bg-gradient-to-r from-[#C53D39] to-[#F1BA69] text-white shadow-lg backdrop-blur-sm font-medium text-xs ${
                          badgeConfig.direction === "vertical"
                            ? "px-2 py-3 rounded-full flex flex-col items-center gap-1"
                            : "px-3 py-2 rounded-full flex items-center gap-2"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span
                          className={badgeConfig.direction === "vertical" ? "writing-mode-vertical text-center" : ""}
                        >
                          {badgeConfig.text}
                        </span>
                      </div>
                    </div>

                    {/* Animated Drawing Border with Website Brand Gradient */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Top border */}
                      <div className="absolute top-10 left-10 right-10 h-px bg-gradient-to-r from-[#C53D39] to-[#F1BA69] origin-left scale-x-0 group-hover:animate-[drawTop_0.4s_ease-out_0.1s_forwards]"></div>

                      {/* Right border */}
                      <div className="absolute top-10 right-10 bottom-10 w-px bg-gradient-to-b from-[#F1BA69] to-[#C53D39] origin-top scale-y-0 group-hover:animate-[drawRight_0.4s_ease-out_0.5s_forwards]"></div>

                      {/* Bottom border */}
                      <div className="absolute bottom-10 left-10 right-10 h-px bg-gradient-to-l from-[#C53D39] to-[#F1BA69] origin-right scale-x-0 group-hover:animate-[drawBottom_0.4s_ease-out_0.9s_forwards]"></div>

                      {/* Left border */}
                      <div className="absolute top-10 left-10 bottom-10 w-px bg-gradient-to-t from-[#F1BA69] to-[#C53D39] origin-bottom scale-y-0 group-hover:animate-[drawLeft_0.4s_ease-out_1.3s_forwards]"></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
              <Image
                src={images[selectedImage] || "/placeholder.svg"}
                alt={`${projectTitle} - Lightbox ${selectedImage + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Lightbox Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes drawTop {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes drawRight {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        @keyframes drawBottom {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes drawLeft {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }

        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  )
}
