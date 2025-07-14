"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCompare } from "@/hooks/use-compare"
import Image from "next/image"
import Link from "next/link"

export function FloatingComparePanel() {
  const { items, removeFromCompare, clearCompare } = useCompare()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(items.length > 0)
  }, [items])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#C53D39]" />
            <h3 className="font-semibold text-gray-900 font-montserrat">Compare Products</h3>
          </div>
          <button onClick={clearCompare} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg group">
              <div className="w-10 h-10 bg-white rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate font-poppins">{item.name}</p>
                <p className="text-xs text-[#C53D39] font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeFromCompare(item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{items.length}/4 products selected</span>
          <div className="flex space-x-1">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${index < items.length ? "bg-[#C53D39]" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>

        <Button
          asChild
          className="w-full bg-gradient-to-r from-[#C53D39] to-[#F1BA69] hover:from-[#B12E2A] hover:to-[#E0A85A] text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
          disabled={items.length < 2}
        >
          <Link href="/compare">
            Compare Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
