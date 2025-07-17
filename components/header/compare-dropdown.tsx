"use client"

import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import { Scale, Trash2, X, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"

interface CompareDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export function CompareDropdown({ isOpen, onClose, isMobile = false }: CompareDropdownProps) {
  const { items, removeItem, clearAll } = useCompare()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose}>
        <div
          ref={dropdownRef}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-poppins">Compare Products</h3>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <Scale className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products to compare</h3>
                <p className="text-gray-500 text-center mb-6">Add products to compare their features</p>
                <Link href="/shop">
                  <Button
                    onClick={onClose}
                    className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold px-6 py-2 rounded-full transition-all duration-300"
                  >
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate text-sm">{item.name}</h4>
                      <p className="text-sm text-[#C53D39] font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-white space-y-3">
              <Link href="/compare" className="block">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white font-semibold"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Compare Now
                </Button>
              </Link>
              <Button
                onClick={() => {
                  clearAll()
                  onClose()
                }}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Desktop dropdown
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden"
    >
      {items.length === 0 ? (
        <div className="p-6 text-center">
          <Scale className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No products to compare</h3>
          <p className="text-xs text-gray-500 mb-4">Add products to compare their features</p>
          <Link href="/shop">
            <Button
              onClick={onClose}
              size="sm"
              className="bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white"
            >
              Browse Products
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Compare ({items.length})</h3>
            <Button onClick={clearAll} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 text-xs">
              Clear All
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-4 border-b border-gray-100 last:border-b-0">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-[#C53D39] font-semibold">{formatPrice(item.price)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <Link href="/compare" className="block">
              <Button
                onClick={onClose}
                size="sm"
                className="w-full bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] text-white"
              >
                <Eye className="h-3 w-3 mr-2" />
                Compare Now
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
