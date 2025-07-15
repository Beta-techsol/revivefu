"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface Filters {
  categories: string[]
  roomTypes: string[]
}

interface FiltersSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, onFiltersChange }) => {
  const [categories, setCategories] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState<string[]>([])

  useEffect(() => {
    // Fetch categories (replace with your actual API endpoint)
    const fetchCategories = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 50))
        setCategories(["Sofa", "Chair", "Table", "Bed", "Lighting"])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    // Fetch room types (replace with your actual API endpoint)
    const fetchRoomTypes = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 50))
        setRoomTypes(["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office"])
      } catch (error) {
        console.error("Error fetching room types:", error)
      }
    }

    fetchRoomTypes()
  }, [])

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Categories section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter((c) => c !== category)
                  onFiltersChange({ ...filters, categories: newCategories })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Room Types section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Shop by Room</h3>
        <div className="space-y-2">
          {roomTypes.map((roomType) => (
            <label key={roomType} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.roomTypes.includes(roomType)}
                onChange={(e) => {
                  const newRoomTypes = e.target.checked
                    ? [...filters.roomTypes, roomType]
                    : filters.roomTypes.filter((b) => b !== roomType)
                  onFiltersChange({ ...filters, roomTypes: newRoomTypes })
                }}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">{roomType}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FiltersSidebar
