"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterTagsProps {
  filters: {
    categories: string[]
    priceRange: [number, number]
    materials: string[]
    colors: string[]
    brands: string[]
    rating: number
    inStockOnly: boolean
    search: string // Added search to filter interface
  }
  onRemoveFilter: (filterType: string, value?: string) => void
  onClearAll: () => void
}

export function FilterTags({ filters, onRemoveFilter, onClearAll }: FilterTagsProps) {
  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.colors.length > 0 ||
    filters.brands.length > 0 ||
    filters.rating > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000 ||
    filters.search.length > 0 // Include search in active filters check

  if (!hasActiveFilters) return null

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Active Filters:</h3>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.search && (
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">Search: "{filters.search}"</span>
            <button onClick={() => onRemoveFilter("search")} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Category Tags */}
        {filters.categories.map((category) => (
          <div
            key={category}
            className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
          >
            <span className="text-gray-700">{category}</span>
            <button
              onClick={() => onRemoveFilter("categories", category)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Material Tags */}
        {filters.materials.map((material) => (
          <div
            key={material}
            className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm"
          >
            <span className="text-gray-700">{material}</span>
            <button
              onClick={() => onRemoveFilter("materials", material)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Color Tags */}
        {filters.colors.map((color) => (
          <div key={color} className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">{color}</span>
            <button onClick={() => onRemoveFilter("colors", color)} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Brand Tags */}
        {filters.brands.map((brand) => (
          <div key={brand} className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">{brand}</span>
            <button onClick={() => onRemoveFilter("brands", brand)} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Price Range Tag */}
        {(filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) && (
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </span>
            <button onClick={() => onRemoveFilter("priceRange")} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Rating Tag */}
        {filters.rating > 0 && (
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">{filters.rating}+ Stars</span>
            <button onClick={() => onRemoveFilter("rating")} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* In Stock Tag */}
        {filters.inStockOnly && (
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
            <span className="text-gray-700">In Stock Only</span>
            <button onClick={() => onRemoveFilter("inStockOnly")} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
