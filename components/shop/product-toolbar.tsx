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
    <div className="flex items-center justify-between gap-2 sm:gap-4 py-3 px-3 sm:px-6 bg-white border-b border-gray-200">
      {/* Results Count */}
      <div className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex-shrink-0">
        Showing {startItem}-{endItem} of {totalResults} results
      </div>

      {/* Controls - All inline with compact mobile layout */}
      <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        {/* Sort By - Hide label on mobile, compact dropdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline text-sm text-gray-700 whitespace-nowrap">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between gap-1 bg-transparent text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-[80px] sm:min-w-[120px] h-8 sm:h-9"
              >
                <span className="truncate">{sortOptions.find((option) => option.value === sortBy)?.label}</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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

        {/* Items Per Page - Hide label on mobile, compact dropdown */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline text-sm text-gray-700 whitespace-nowrap">Show:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between gap-1 bg-transparent text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-[50px] sm:min-w-[70px] h-8 sm:h-9"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
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

        {/* View Mode Toggle - Compact on mobile */}
        <div className="flex items-center border border-gray-300 rounded">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`rounded-r-none px-1.5 sm:px-2 py-1 h-8 sm:h-9 ${
              viewMode === "grid" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={`rounded-l-none border-l px-1.5 sm:px-2 py-1 h-8 sm:h-9 ${
              viewMode === "list" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            <List className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
