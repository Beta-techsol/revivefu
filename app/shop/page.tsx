"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { FilterTags } from "@/components/shop/filter-tags"
import { Pagination } from "@/components/shop/pagination"
import { ProductCard } from "@/components/product-card"
import { QuickViewModal } from "@/components/quick-view-modal"
import { HeroSlider } from "@/components/shop/hero-slider"
import { Filter } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string | string[]
  description?: string
  short_description?: string
  average_rating?: number
  review_count?: number
  stock_quantity?: number
  category_name?: string
  room_type?: string
  material?: string
  color?: string
  brand?: string
}

interface Filters {
  categories: string[]
  priceRange: [number, number]
  colors: string[]
  materials: string[]
  brands: string[]
  rooms: string[]
  inStock: boolean
  onSale: boolean
  rating: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 500000],
    colors: [],
    materials: [],
    brands: [],
    rooms: [],
    inStock: false,
    onSale: false,
    rating: 0,
  })

  const productsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products?limit=200")
      const data = await response.json()

      if (data && data.success && Array.isArray(data.products)) {
        setProducts(data.products)
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products)
      } else if (Array.isArray(data)) {
        setProducts(data)
      } else {
        console.error("Unexpected API response format:", data)
        setProducts([])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.some((cat) => product.category_name?.toLowerCase().includes(cat.toLowerCase())),
      )
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        filters.colors.some((color) => product.color?.toLowerCase().includes(color.toLowerCase())),
      )
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter((product) =>
        filters.materials.some((material) => product.material?.toLowerCase().includes(material.toLowerCase())),
      )
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.some((brand) => product.brand?.toLowerCase().includes(brand.toLowerCase())),
      )
    }

    // Room filter
    if (filters.rooms.length > 0) {
      filtered = filtered.filter((product) =>
        filters.rooms.some((room) => product.room_type?.toLowerCase().includes(room.toLowerCase())),
      )
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => (product.stock_quantity || 0) > 0)
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter((product) => product.compare_price && product.compare_price > product.price)
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => (product.average_rating || 0) >= filters.rating)
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return (b.average_rating || 0) - (a.average_rating || 0)
        case "newest":
          return new Date(b.id).getTime() - new Date(a.id).getTime()
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const transformProduct = (product: Product) => {
    let productImages: string[] = []
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images)
        productImages = Array.isArray(parsed) ? parsed : [product.images]
      } catch {
        productImages = [product.images]
      }
    } else if (Array.isArray(product.images)) {
      productImages = product.images
    }

    return {
      id: product.id,
      name: product.name || "Untitled Product",
      price: product.price || 0,
      originalPrice: product.compare_price || undefined,
      image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage:
        productImages.length > 1 ? productImages[1] : productImages[0] || "/placeholder.svg?height=400&width=400",
      description: product.short_description || product.description || "",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      isOnSale: !!(product.compare_price && product.compare_price > product.price),
      isSoldOut: (product.stock_quantity || 0) === 0,
      discount:
        product.compare_price && product.price
          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
          : 0,
    }
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    setIsQuickViewOpen(true)
  }

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false)
    setSelectedProduct(null)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 500000],
      colors: [],
      materials: [],
      brands: [],
      rooms: [],
      inStock: false,
      onSale: false,
      rating: 0,
    })
  }

  const removeFilter = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type as keyof Filters].filter((item: any) => item !== value),
    }))
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSlider />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FiltersSidebar filters={filters} onFiltersChange={setFilters} onClearFilters={clearFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full justify-center">
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            {/* Active Filters */}
            <FilterTags filters={filters} onRemoveFilter={removeFilter} onClearAll={clearFilters} />

            {/* Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Products Grid/List */}
            {currentProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {currentProducts.map((product) => {
                  const transformedProduct = transformProduct(product)
                  return (
                    <ProductCard
                      key={product.id}
                      product={transformedProduct}
                      onQuickView={() => handleQuickView(product)}
                      viewMode={viewMode}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={productsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct ? transformProduct(selectedProduct) : null}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  )
}
