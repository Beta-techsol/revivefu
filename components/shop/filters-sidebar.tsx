"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { DualRangeSlider } from "@/components/ui/dual-range-slider"
import { CustomCheckbox } from "@/components/ui/custom-checkbox"

interface FiltersSidebarProps {
  filters: {
    categories: string[]
    priceRange: [number, number]
    materials: string[]
    colors: string[]
    brands: string[]
    rating: number
    inStockOnly: boolean
  }
  onFiltersChange: (filters: any) => void
}

const categories = ["Sofa", "Bed", "Dining Table", "Chair", "Wardrobe", "Coffee Table", "Office Furniture"]

const materials = [
  { name: "Wood", gradient: "from-amber-600 to-amber-800" },
  { name: "Metal", gradient: "from-gray-500 to-gray-700" },
  { name: "Fabric", gradient: "from-blue-500 to-purple-600" },
  { name: "Leather", gradient: "from-amber-700 to-orange-800" },
  { name: "Glass", gradient: "from-cyan-400 to-blue-500" },
]

const colors = [
  { name: "Beige", color: "#F5F5DC" },
  { name: "Brown", color: "#8B4513" },
  { name: "Black", color: "#000000" },
  { name: "White", color: "#FFFFFF" },
  { name: "Grey", color: "#808080" },
  { name: "Blue", color: "#4169E1" },
]

const brands = [
  "All Filz Premium",
  "Comfort Zone",
  "Modern Living",
  "Elite Furniture",
  "Luxury Home",
  "Classic Design",
  "Contemporary Style",
  "Urban Comfort",
]

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    material: true,
    color: true,
    brand: true,
    rating: true,
    availability: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }))
  }

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Filters</h2>

      {/* Category Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Category
          {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <CustomCheckbox
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleArrayFilter("categories", category)}
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Price Range
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
            <DualRangeSlider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
              min={0}
              max={5000}
              step={50}
            />
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("material")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Material
          {expandedSections.material ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.material && (
          <div className="space-y-2">
            {materials.map((material) => (
              <label key={material.name} className="flex items-center space-x-3 cursor-pointer">
                <CustomCheckbox
                  checked={filters.materials.includes(material.name)}
                  onCheckedChange={() => toggleArrayFilter("materials", material.name)}
                />
                <div className={`w-4 h-4 rounded bg-gradient-to-r ${material.gradient}`}></div>
                <span className="text-sm text-gray-700">{material.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Color
          {expandedSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.color && (
          <div className="grid grid-cols-3 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleArrayFilter("colors", color.name)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                  filters.colors.includes(color.name)
                    ? "border-amber-600 scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.color }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Brand
          {expandedSections.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.brand && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                <CustomCheckbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleArrayFilter("brands", brand)}
                />
                <span className="text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Rating
          {expandedSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.rating && (
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => updateFilter("rating", rating)}
                className={`flex items-center space-x-2 w-full text-left p-2 rounded transition-colors ${
                  filters.rating === rating ? "bg-amber-50 border border-amber-200" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < rating ? "text-amber-400" : "text-gray-300"}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-700">& up</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
        >
          Availability
          {expandedSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.availability && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <CustomCheckbox
              checked={filters.inStockOnly}
              onCheckedChange={(checked) => updateFilter("inStockOnly", checked)}
            />
            <span className="text-sm text-gray-700">In Stock Only</span>
          </label>
        )}
      </div>
    </div>
  )
}
