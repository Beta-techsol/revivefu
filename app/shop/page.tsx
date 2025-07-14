"use client"

import { useState, useMemo } from "react"
import { HeroSlider } from "@/components/shop/hero-slider"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { FilterTags } from "@/components/shop/filter-tags"
import { ProductCard } from "@/components/product-card"
import { ProductListCard } from "@/components/shop/product-list-card"
import { Pagination } from "@/components/shop/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample products data - 20 products
const allProducts = [
  {
    id: 1,
    name: "Modern Sectional Sofa",
    price: 1299,
    originalPrice: 1599,
    image: "/shop/products/sofa-1.jpg",
    category: "Sofa",
    material: "Fabric",
    color: "Beige",
    brand: "All Filz Premium",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: true,
    isSale: true,
  },
  {
    id: 2,
    name: "Luxury Leather Sofa",
    price: 2199,
    image: "/shop/products/sofa-2.jpg",
    category: "Sofa",
    material: "Leather",
    color: "Brown",
    brand: "Comfort Zone",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 449,
    originalPrice: 599,
    image: "/shop/products/chair-1.jpg",
    category: "Chair",
    material: "Fabric",
    color: "Black",
    brand: "Modern Living",
    rating: 4.3,
    reviews: 156,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 4,
    name: "Solid Wood Dining Table",
    price: 899,
    image: "/shop/products/dining-table-1.jpg",
    category: "Dining Table",
    material: "Wood",
    color: "Brown",
    brand: "Elite Furniture",
    rating: 4.6,
    reviews: 73,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: 5,
    name: "King Size Platform Bed",
    price: 1099,
    originalPrice: 1299,
    image: "/shop/products/bed-1.jpg",
    category: "Bed",
    material: "Wood",
    color: "White",
    brand: "Luxury Home",
    rating: 4.4,
    reviews: 92,
    inStock: false,
    isNew: false,
    isSale: true,
  },
  {
    id: 6,
    name: "Glass Coffee Table",
    price: 349,
    image: "/shop/products/coffee-table-1.jpg",
    category: "Coffee Table",
    material: "Glass",
    color: "Clear",
    brand: "Classic Design",
    rating: 4.2,
    reviews: 45,
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: 7,
    name: "3-Door Wardrobe",
    price: 799,
    originalPrice: 999,
    image: "/shop/products/wardrobe-1.jpg",
    category: "Wardrobe",
    material: "Wood",
    color: "White",
    brand: "Contemporary Style",
    rating: 4.1,
    reviews: 67,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 8,
    name: "Executive Office Desk",
    price: 649,
    image: "/shop/products/sofa-1.jpg",
    category: "Office Furniture",
    material: "Wood",
    color: "Brown",
    brand: "Urban Comfort",
    rating: 4.5,
    reviews: 34,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: 9,
    name: "Velvet Accent Chair",
    price: 299,
    originalPrice: 399,
    image: "/shop/products/chair-1.jpg",
    category: "Chair",
    material: "Fabric",
    color: "Blue",
    brand: "All Filz Premium",
    rating: 4.7,
    reviews: 112,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 10,
    name: "Round Dining Table",
    price: 749,
    image: "/shop/products/dining-table-1.jpg",
    category: "Dining Table",
    material: "Wood",
    color: "Beige",
    brand: "Comfort Zone",
    rating: 4.3,
    reviews: 58,
    inStock: true,
    isNew: false,
    isSale: false,
  },
  {
    id: 11,
    name: "Memory Foam Mattress",
    price: 599,
    originalPrice: 799,
    image: "/shop/products/bed-1.jpg",
    category: "Bed",
    material: "Fabric",
    color: "White",
    brand: "Modern Living",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    isNew: true,
    isSale: true,
  },
  {
    id: 12,
    name: "Metal Coffee Table",
    price: 199,
    image: "/shop/products/coffee-table-1.jpg",
    category: "Coffee Table",
    material: "Metal",
    color: "Black",
    brand: "Elite Furniture",
    rating: 4.0,
    reviews: 29,
    inStock: false,
    isNew: false,
    isSale: false,
  },
  {
    id: 13,
    name: "Sliding Door Wardrobe",
    price: 1199,
    originalPrice: 1499,
    image: "/shop/products/wardrobe-1.jpg",
    category: "Wardrobe",
    material: "Wood",
    color: "Grey",
    brand: "Luxury Home",
    rating: 4.4,
    reviews: 81,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 14,
    name: "Standing Desk",
    price: 549,
    image: "/shop/products/sofa-1.jpg",
    category: "Office Furniture",
    material: "Metal",
    color: "White",
    brand: "Classic Design",
    rating: 4.2,
    reviews: 47,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: 15,
    name: "Recliner Chair",
    price: 899,
    originalPrice: 1099,
    image: "/shop/products/chair-1.jpg",
    category: "Chair",
    material: "Leather",
    color: "Brown",
    brand: "Contemporary Style",
    rating: 4.8,
    reviews: 95,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 16,
    name: "Extendable Dining Table",
    price: 1049,
    image: "/shop/products/dining-table-1.jpg",
    category: "Dining Table",
    material: "Wood",
    color: "Brown",
    brand: "Urban Comfort",
    rating: 4.5,
    reviews: 62,
    inStock: true,
    isNew: true,
    isSale: false,
  },
  {
    id: 17,
    name: "Queen Size Bed Frame",
    price: 449,
    originalPrice: 599,
    image: "/shop/products/bed-1.jpg",
    category: "Bed",
    material: "Metal",
    color: "Black",
    brand: "All Filz Premium",
    rating: 4.1,
    reviews: 74,
    inStock: true,
    isNew: false,
    isSale: true,
  },
  {
    id: 18,
    name: "Marble Coffee Table",
    price: 799,
    image: "/shop/products/coffee-table-1.jpg",
    category: "Coffee Table",
    material: "Glass",
    color: "White",
    brand: "Comfort Zone",
    rating: 4.7,
    reviews: 38,
    inStock: false,
    isNew: true,
    isSale: false,
  },
  {
    id: 19,
    name: "Walk-in Wardrobe",
    price: 2499,
    originalPrice: 2999,
    image: "/shop/products/wardrobe-1.jpg",
    category: "Wardrobe",
    material: "Wood",
    color: "Beige",
    brand: "Modern Living",
    rating: 4.9,
    reviews: 23,
    inStock: true,
    isNew: true,
    isSale: true,
  },
  {
    id: 20,
    name: "Conference Table",
    price: 1299,
    image: "/shop/products/sofa-1.jpg",
    category: "Office Furniture",
    material: "Wood",
    color: "Brown",
    brand: "Elite Furniture",
    rating: 4.3,
    reviews: 41,
    inStock: true,
    isNew: false,
    isSale: false,
  },
]

export default function ShopPage() {
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
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
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
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
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "popularity":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case "latest":
      default:
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
    }

    return filtered
  }, [filters, sortBy])

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
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={handleQuickView}
                        onAddToCart={handleAddToCart}
                      />
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
