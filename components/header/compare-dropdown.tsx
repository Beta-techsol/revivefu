"use client"

import { useEffect, useRef } from "react"
import { X, ArrowRight, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import Image from "next/image"
import Link from "next/link"

interface CompareDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function CompareDropdown({ isOpen, onClose }: CompareDropdownProps) {
  const { items, removeFromCompare, clearCompare } = useCompare()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 font-montserrat">Compare Products</h3>
          {items.length > 0 && (
            <button
              onClick={clearCompare}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors font-poppins"
            >
              Clear All
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 font-poppins mt-1">{items.length}/4 products selected</p>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <Scale className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-poppins">No products to compare</p>
            <p className="text-sm text-gray-400 font-poppins mt-1">Add products to compare their features</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm font-poppins truncate">{item.name}</h4>
                  <p className="text-sm font-semibold text-[#C53D39] font-poppins">${item.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-gray-100">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white"
            onClick={onClose}
          >
            <Link href="/compare">
              Compare Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
