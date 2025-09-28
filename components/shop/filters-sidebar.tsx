"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DualRangeSlider } from "@/components/ui/dual-range-slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Star, X } from "lucide-react"

interface Filters {
  categories: string[]
  priceRange: [number, number]
  materials: string[]
  colors: string[]
  brands: string[]
  roomTypes: string[]
  rating: number
  inStockOnly: boolean
}

interface FiltersSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [availableOptions, setAvailableOptions] = useState({
    categories: [] as string[],
    materials: [] as string[],
    colors: [] as string[],
    roomTypes: [] as string[],
  })

  // Fetch available filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/products?limit=1000")
        const data = await response.json()

        if (data.success && data.products) {
          const allCategories = new Set<string>()
          data.products.forEach((product: any) => {
            if (Array.isArray(product.categories)) {
              product.categories.forEach((cat: any) => {
                if (cat.name) allCategories.add(cat.name)
              })
            }
            // Fallback for backward compatibility
            if (product.category_name) {
              allCategories.add(product.category_name)
            }
          })

          const materials = [...new Set(data.products.map((p: any) => p.material).filter(Boolean))]
          const colors = [...new Set(data.products.map((p: any) => p.color).filter(Boolean))]
          const roomTypes = [...new Set(data.products.map((p: any) => p.room_type_name).filter(Boolean))]

          setAvailableOptions({
            categories: Array.from(allCategories).sort(),
            materials: materials.sort(),
            colors: colors.sort(),
            roomTypes: roomTypes.sort(),
          })
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

  const handleFilterChange = (filterType: keyof Filters, value: any) => {
    const newFilters = { ...filters, [filterType]: value }
    onFiltersChange(newFilters)
  }

  const handleCheckboxChange = (
    filterType: "categories" | "materials" | "colors" | "roomTypes",
    value: string,
    checked: boolean,
  ) => {
    const currentValues = filters[filterType]
    const newValues = checked ? [...currentValues, value] : currentValues.filter((item) => item !== value)

    handleFilterChange(filterType, newValues)
  }

  const clearFilter = (filterType: keyof Filters) => {
    switch (filterType) {
      case "categories":
      case "materials":
      case "colors":
      case "roomTypes":
        handleFilterChange(filterType, [])
        break
      case "priceRange":
        handleFilterChange(filterType, [0, 500000])
        break
      case "rating":
        handleFilterChange(filterType, 0)
        break
      case "inStockOnly":
        handleFilterChange(filterType, false)
        break
    }
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 500000],
      materials: [],
      colors: [],
      brands: [],
      roomTypes: [],
      rating: 0,
      inStockOnly: false,
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.materials.length > 0 ||
    filters.colors.length > 0 ||
    filters.roomTypes.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500000 ||
    filters.rating > 0 ||
    filters.inStockOnly

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm px-2 sm:px-3"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Categories</h4>
            {filters.categories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("categories")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            {availableOptions.categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCheckboxChange("categories", category, checked as boolean)}
                  className="h-3 w-3 sm:h-4 sm:w-4"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Price Range */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Price Range</h4>
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("priceRange")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="px-2">
            <DualRangeSlider
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
              max={500000}
              min={0}
              step={1000}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Rs{filters.priceRange[0].toLocaleString()}</span>
              <span>Rs{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Room Types */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Room Types</h4>
            {filters.roomTypes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("roomTypes")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableOptions.roomTypes.map((roomType) => (
              <div key={roomType} className="flex items-center space-x-2">
                <Checkbox
                  id={`room-${roomType}`}
                  checked={filters.roomTypes.includes(roomType)}
                  onCheckedChange={(checked) => handleCheckboxChange("roomTypes", roomType, checked as boolean)}
                />
                <label htmlFor={`room-${roomType}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                  {roomType}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Materials */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Materials</h4>
            {filters.materials.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("materials")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableOptions.materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={(checked) => handleCheckboxChange("materials", material, checked as boolean)}
                />
                <label htmlFor={`material-${material}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                  {material}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Colors */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Colors</h4>
            {filters.colors.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("colors")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {availableOptions.colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={(checked) => handleCheckboxChange("colors", color, checked as boolean)}
                />
                <label htmlFor={`color-${color}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Rating */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Rating</h4>
            {filters.rating > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearFilter("rating")}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => handleFilterChange("rating", checked ? rating : 0)}
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="text-sm text-gray-700 cursor-pointer flex items-center space-x-1"
                >
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span>& up</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        {/* Stock Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => handleFilterChange("inStockOnly", checked as boolean)}
            />
            <label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer">
              In Stock Only
            </label>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheckboxChange("categories", category, false)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
              {filters.roomTypes.map((roomType) => (
                <Badge key={roomType} variant="secondary" className="text-xs">
                  {roomType}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheckboxChange("roomTypes", roomType, false)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
              {filters.materials.map((material) => (
                <Badge key={material} variant="secondary" className="text-xs">
                  {material}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheckboxChange("materials", material, false)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
              {filters.colors.map((color) => (
                <Badge key={color} variant="secondary" className="text-xs">
                  {color}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCheckboxChange("colors", color, false)}
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
