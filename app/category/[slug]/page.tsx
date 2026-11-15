"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { FiltersSidebar } from "@/components/shop/filters-sidebar"
import { ProductToolbar } from "@/components/shop/product-toolbar"
import { FilterTags } from "@/components/shop/filter-tags"
import { Pagination } from "@/components/shop/pagination"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string | string[]
  category_name: string
  material: string
  color: string
  brand: string
  average_rating: number
  review_count: number
  stock_quantity: number
  tags: string | string[]
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  description: string
  short_description: string
  room_type: string
  room_type_slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  product_count: number
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 500000] as [number, number],
    materials: [] as string[],
    colors: [] as string[],
    brands: [] as string[],
    rating: 0,
    inStockOnly: false,
    roomTypes: [] as string[],
  })

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("latest")
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryAndProducts()
    }
  }, [categorySlug])

  const fetchCategoryAndProducts = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      // Fetch category info
      const categoryResponse = await fetch("/api/categories", { cache: "no-store" })
      const categoryData = await categoryResponse.json()

      if (categoryData.success) {
        const foundCategory = categoryData.categories.find((cat: Category) => cat.slug === categorySlug)
        setCategory(foundCategory || null)
      }

      // Fetch products for this category
      const productsResponse = await fetch(`/api/products?category=${categorySlug}`, { cache: "no-store" })
      const productsData = await productsResponse.json()

      if (productsData.success && productsData.products) {
        setProducts(productsData.products)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Failed to fetch category data:", error)
      setProducts([])
      setCategory(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    fetchCategoryAndProducts(true)
  }

  // Transform product for component compatibility
  const transformProduct = (product: Product) => {
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

    const productImages = getProductImages(product.images)

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage: productImages.length > 1 ? productImages[1] : productImages[0],
      category: product.category_name || "",
      material: product.material || "",
      color: product.color || "",
      brand: product.brand || "",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      inStock: product.stock_quantity > 0,
      stockQuantity: product.stock_quantity || 0,
      isNew: product.is_latest,
      isSale: !!product.compare_price && product.compare_price > product.price,
      description: product.description || product.short_description || "",
      roomType: product.room_type || "",
    }
  }

  // Filter and sort products (similar to shop page logic)
  const filteredProducts = products
    .filter((product) => {
      // Apply filters here
      if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) {
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
          return false
        }
      }

      if (filters.materials.length > 0 && !filters.materials.includes(product.material || "")) {
        return false
      }

      if (filters.colors.length > 0 && !filters.colors.includes(product.color || "")) {
        return false
      }

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand || "")) {
        return false
      }

      if (filters.rating > 0 && (product.average_rating || 0) < filters.rating) {
        return false
      }

      if (filters.inStockOnly && product.stock_quantity === 0) {
        return false
      }

      return true
    })
    .map(transformProduct)

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleRemoveFilter = (filterType: string, value?: string) => {
    const newFilters = { ...filters }

    switch (filterType) {
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
        newFilters.priceRange = [0, 500000]
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
      priceRange: [0, 500000],
      materials: [],
      colors: [],
      brands: [],
      roomTypes: [],
      rating: 0,
      inStockOnly: false,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/shop">Browse All Products</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-6">
            {category.image_url && (
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={category.image_url || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-montserrat mb-2">{category.name}</h1>
              {category.description && <p className="text-gray-600 font-poppins mb-2">{category.description}</p>}
              <p className="text-sm text-gray-500 font-poppins">{products.length} products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        {sidebarVisible && (
          <div className="hidden lg:block">
            <FiltersSidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Filter Tags */}
          <FilterTags filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />

          {/* Product Toolbar */}
          <div className="flex">
            <div className="hidden lg:flex items-center bg-white border-b border-gray-200">
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

            <div className="flex items-center bg-white border-b border-gray-200">
              <Button onClick={handleRefresh} variant="ghost" size="sm" disabled={refreshing} className="m-2">
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-6">
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
                <Button onClick={handleClearAllFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={() => {}} />
                  ))}
                </div>

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
