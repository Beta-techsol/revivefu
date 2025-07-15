"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { Pagination } from "@/components/shop/pagination"
import { ProductListCard } from "@/components/shop/product-list-card"
import { HeroSlider } from "@/components/shop/hero-slider"
import { FilterTags } from "@/components/shop/filter-tags"
import { SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string[]
  category_name: string
  room_type: string
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  average_rating: number
  review_count: number
  stock_quantity: number
}

interface Filters {
  category: string
  room_type: string
  price_min: number
  price_max: number
  search: string
  featured: boolean
  trending: boolean
  best_seller: boolean
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [sortBy, setSortBy] = useState("newest")
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    room_type: "all",
    price_min: 0,
    price_max: 10000,
    search: "",
    featured: false,
    trending: false,
    best_seller: false,
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      })

      if (filters.category !== "all") {
        params.append("category", filters.category)
      }
      if (filters.room_type !== "all") {
        params.append("room_type", filters.room_type)
      }
      if (filters.search) {
        params.append("search", filters.search)
      }
      if (filters.featured) {
        params.append("featured", "true")
      }
      if (filters.trending) {
        params.append("trending", "true")
      }
      if (filters.best_seller) {
        params.append("best_seller", "true")
      }

      console.log("Fetching products with params:", params.toString())

      const response = await fetch(`/api/products?${params}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch products")
      }

      setProducts(data.products || [])
      setTotalPages(data.pagination?.pages || 1)
      setTotalProducts(data.pagination?.total || 0)

      console.log("Products fetched successfully:", data.products?.length || 0)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentPage, filters])

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      room_type: "all",
      price_min: 0,
      price_max: 10000,
      search: "",
      featured: false,
      trending: false,
      best_seller: false,
    })
    setCurrentPage(1)
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "category" || key === "room_type") return value !== "all"
    if (key === "price_min") return value > 0
    if (key === "price_max") return value < 10000
    if (key === "search") return value !== ""
    return value === true
  }).length

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Error loading products: {error}</p>
            <Button onClick={fetchProducts} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            <FilterTags filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />

            {/* Toolbar */}
            <ProductToolbar
              totalProducts={totalProducts}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Products Grid/List */}
            {loading ? (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="aspect-square w-full mb-4" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-6 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {products.map((product) => (
                  <ProductListCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
