"use client"

import { Grid, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProductToolbarProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  sortBy: string
  onSortChange: (sort: string) => void
  itemsPerPage: number
  onItemsPerPageChange: (items: number) => void
  totalResults: number
  currentPage: number
}

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Customer Rating" },
]

const itemsPerPageOptions = [12, 24, 48]

export function ProductToolbar({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalResults,
  currentPage,
}: ProductToolbarProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalResults)

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalResults} results
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <span>{sortOptions.find((option) => option.value === sortBy)?.label}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? "bg-amber-50 text-amber-700" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Items Per Page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {itemsPerPageOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => onItemsPerPageChange(option)}
                  className={itemsPerPage === option ? "bg-amber-50 text-amber-700" : ""}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border border-gray-300 rounded">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-r-none ${
              viewMode === "grid" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`rounded-l-none border-l ${
              viewMode === "list" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
