"use client"

import { useState, useEffect } from "react"
import { HeroSlider } from "@/components/shop/hero-slider"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { ProductListCard } from "@/components/shop/product-list-card"
import { FilterTags } from "@/components/shop/filter-tags"
import { Pagination } from "@/components/shop/pagination"
import { QuickViewModal } from "@/components/quick-view-modal"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string | string[]
  description: string
  short_description: string
  average_rating: number
  review_count: number
  stock_quantity: number
  category_name: string
  room_type: string
  material: string
  color: string
  brand: string
}

interface Filters {
  category: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  brand: string[]
  material: string[]
  color: string[]
  roomType: string[]
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [productsPerPage] = useState(12)

  const [filters, setFilters] = useState<Filters>({
    category: [],
    priceRange: [0, 500000],
    rating: 0,
    inStock: false,
    brand: [],
    material: [],
    color: [],
    roomType: [],
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products?limit=100")
      const data = await response.json()

      if (data.success && data.products) {
        setProducts(data.products)
      } else if (data.products) {
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

  const getProductImages = (images: string | string[]) => {
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed : [images]
      } catch {
        return [images]
      }
    }
    return Array.isArray(images) ? images : []
  }

  const transformProduct = (product: Product) => {
    const productImages = getProductImages(product.images)

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage:
        productImages.length > 1 ? productImages[1] : productImages[0] || "/placeholder.svg?height=400&width=400",
      description: product.short_description || product.description || "",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      isOnSale: !!product.compare_price && product.compare_price > product.price,
      isSoldOut: product.stock_quantity === 0,
      discount: product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0,
      category: product.category_name,
      brand: product.brand,
      material: product.material,
      color: product.color,
      roomType: product.room_type,
      inStock: product.stock_quantity > 0,
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((product) => filters.category.includes(product.category_name))
    }

    // Price range filter
    filtered = filtered.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => (product.average_rating || 0) >= filters.rating)
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock_quantity > 0)
    }

    // Brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter((product) => filters.brand.includes(product.brand))
    }

    // Material filter
    if (filters.material.length > 0) {
      filtered = filtered.filter((product) => filters.material.includes(product.material))
    }

    // Color filter
    if (filters.color.length > 0) {
      filtered = filtered.filter((product) => filters.color.includes(product.color))
    }

    // Room type filter
    if (filters.roomType.length > 0) {
      filtered = filtered.filter((product) => filters.roomType.includes(product.room_type))
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

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 500000],
      rating: 0,
      inStock: false,
      brand: [],
      material: [],
      color: [],
      roomType: [],
    })
  }

  const handleQuickView = (product: any) => {
    setQuickViewProduct(product)
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const transformedProducts = currentProducts.map(transformProduct)

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
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="w-full mb-4">
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="lg:sticky lg:top-4">
              <FiltersSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                products={products}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Filter Tags */}
            <FilterTags
              filters={filters}
              onRemoveFilter={(filterType, value) => {
                const newFilters = { ...filters }
                if (Array.isArray(newFilters[filterType as keyof Filters])) {
                  ;(newFilters[filterType as keyof Filters] as string[]) = (
                    newFilters[filterType as keyof Filters] as string[]
                  ).filter((item) => item !== value)
                } else if (filterType === "rating") {
                  newFilters.rating = 0
                } else if (filterType === "inStock") {
                  newFilters.inStock = false
                }
                setFilters(newFilters)
              }}
              onClearAll={clearFilters}
            />

            {/* Product Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              productsPerPage={productsPerPage}
            />

            {/* Products Grid/List */}
            {transformedProducts.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {transformedProducts.map((product) => (
                  <ProductListCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
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

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
