"use client"

import { useState, useEffect, useMemo } from "react"
import { HeroSlider } from "@/components/shop/hero-slider"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { FilterTags } from "@/components/shop/filter-tags"
import { ProductCard } from "@/components/product-card"
import { ProductListCard } from "@/components/shop/product-list-card"
import { Pagination } from "@/components/shop/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string[]
  category_name: string
  material: string
  color: string
  brand: string
  average_rating: number
  review_count: number
  stock_quantity: number
  tags: string[]
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
}

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 5000] as [number, number],
    materials: [] as string[],
    colors: [] as string[],
    brands: [] as string[],
    rating: 0,
    inStockOnly: false,
  })

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("latest")
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=100")
      const data = await response.json()

      if (data.success && data.products) {
        setAllProducts(data.products)
      } else {
        console.error("Failed to fetch products:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Transform product for component compatibility
  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.compare_price,
    image:
      Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "/placeholder.svg?height=400&width=400",
    category: product.category_name,
    material: product.material,
    color: product.color,
    brand: product.brand,
    rating: product.average_rating || 0,
    reviews: product.review_count || 0,
    inStock: product.stock_quantity > 0,
    isNew: product.is_latest,
    isSale: !!product.compare_price && product.compare_price > product.price,
    tags: Array.isArray(product.tags) ? product.tags : [],
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category_name)) {
        return false
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false
      }

      // Material filter
      if (filters.materials.length > 0 && !filters.materials.includes(product.material)) {
        return false
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
        return false
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      // Rating filter
      if (filters.rating > 0 && product.average_rating < filters.rating) {
        return false
      }

      // Stock filter
      if (filters.inStockOnly && product.stock_quantity === 0) {
        return false
      }

      return true
    })

    // Sort products
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
        break
      case "popularity":
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
        break
      case "latest":
      default:
        filtered.sort((a, b) => (b.is_latest ? 1 : 0) - (a.is_latest ? 1 : 0))
        break
    }

    return filtered.map(transformProduct)
  }, [allProducts, filters, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRemoveFilter = (filterType: string, value?: string) => {
    const newFilters = { ...filters }

    switch (filterType) {
      case "categories":
        newFilters.categories = newFilters.categories.filter((item) => item !== value)
        break
      case "materials":
        newFilters.materials = newFilters.materials.filter((item) => item !== value)
        break
      case "colors":
        newFilters.colors = newFilters.colors.filter((item) => item !== value)
        break
      case "brands":
        newFilters.brands = newFilters.brands.filter((item) => item !== value)
        break
      case "priceRange":
        newFilters.priceRange = [0, 5000]
        break
      case "rating":
        newFilters.rating = 0
        break
      case "inStockOnly":
        newFilters.inStockOnly = false
        break
    }

    handleFiltersChange(newFilters)
  }

  const handleClearAllFilters = () => {
    handleFiltersChange({
      categories: [],
      priceRange: [0, 5000],
      materials: [],
      colors: [],
      brands: [],
      rating: 0,
      inStockOnly: false,
    })
  }

  const handleQuickView = (product: any) => {
    console.log("Quick view:", product)
  }

  const handleAddToCart = (product: any) => {
    console.log("Add to cart:", product)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <HeroSlider />

      <div className="flex">
        {/* Filters Sidebar - conditionally rendered */}
        {sidebarVisible && <FiltersSidebar filters={filters} onFiltersChange={handleFiltersChange} />}

        {/* Main Content */}
        <div className="flex-1">
          {/* Filter Tags */}
          <FilterTags filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />

          {/* Product Toolbar with sidebar toggle */}
          <div className="flex">
            {/* Sidebar Toggle Button */}
            <div className="flex items-center bg-white border-b border-gray-200">
              <button
                onClick={() => setSidebarVisible(!sidebarVisible)}
                className="p-4 hover:bg-gray-50 transition-colors border-r border-gray-200"
                title={sidebarVisible ? "Hide Filters" : "Show Filters"}
              >
                {sidebarVisible ? (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>

            {/* Product Toolbar */}
            <div className="flex-1">
              <ProductToolbar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortBy={sortBy}
                onSortChange={setSortBy}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                totalResults={filteredProducts.length}
                currentPage={currentPage}
              />
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="p-6">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button onClick={handleClearAllFilters} className="text-amber-600 hover:text-amber-700 font-medium">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                      sidebarVisible ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-4"
                    }`}
                  >
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onQuickView={handleQuickView} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedProducts.map((product) => (
                      <ProductListCard
                        key={product.id}
                        product={product}
                        onQuickView={handleQuickView}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
