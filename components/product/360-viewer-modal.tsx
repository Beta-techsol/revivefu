"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, RotateCcw, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThreeSixtyViewerModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  productName: string
}

export default function ThreeSixtyViewerModal({ isOpen, onClose, images, productName }: ThreeSixtyViewerModalProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouseX, setLastMouseX] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalFrames = images.length

  useEffect(() => {
    if (isAutoRotating && !isDragging) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoRotating, isDragging, totalFrames])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setLastMouseX(e.clientX)
    setIsAutoRotating(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouseX
    const sensitivity = 2
    const frameChange = Math.round(deltaX / sensitivity)

    if (Math.abs(frameChange) >= 1) {
      setCurrentFrame((prev) => {
        let newFrame = prev + frameChange
        if (newFrame < 0) newFrame = totalFrames - 1
        if (newFrame >= totalFrames) newFrame = 0
        return newFrame
      })
      setLastMouseX(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const resetRotation = () => {
    setCurrentFrame(0)
    setIsAutoRotating(false)
  }

  const toggleAutoRotation = () => {
    setIsAutoRotating(!isAutoRotating)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">360° View - {productName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Viewer */}
        <div className="relative aspect-square bg-gray-50">
          <div
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={images[currentFrame] || images[0]}
              alt={`${productName} 360° view frame ${currentFrame + 1}`}
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAutoRotation}
              className={cn("flex items-center gap-2", isAutoRotating && "bg-blue-100 text-blue-600")}
            >
              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              Auto Rotate
            </Button>

            <Button variant="ghost" size="sm" onClick={resetRotation}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <div className="text-sm text-gray-600">
              {currentFrame + 1} / {totalFrames}
            </div>
          </div>

          {/* Rotation Indicator */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2">
            <div className="text-xs text-gray-600">Rotation: {Math.round((currentFrame / totalFrames) * 360)}°</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Drag to rotate • Click auto-rotate for continuous spinning • Use reset to return to start
          </p>
        </div>
      </div>
    </div>
  )
}
