"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Clock, TrendingUp, Star, ShoppingCart, Eye, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  slug: string
}

interface SearchProduct {
  id: string
  slug: string
  name: string
  price: number
  compare_price?: number | null
  images: string
  // Many-to-many support:
  categories?: Category[]
  // Backward compatibility:
  category_name?: string | null
  material?: string | null
  color?: string | null
  brand?: string | null
  average_rating: number
  review_count: number
  stock_quantity: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  room_type_name?: string | null
  relevance_score: number
}

interface SearchSuggestion {
  type: string
  value: string
  slug: string
  product_count: number
}

interface SearchResults {
  products: SearchProduct[]
  suggestions: SearchSuggestion[]
  query: string
}

export function SearchComponent() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { addItem } = useCart()

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim().length < 2) return

      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
    },
    [recentSearches],
  )

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      console.log("Performing search for:", searchQuery)
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
      console.log("Search response status:", response.status)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Search response data:", data)

      if (data.success) {
        setResults(data)
      } else {
        console.error("Search API returned error:", data.error)
        setResults({ products: [], suggestions: [], query: searchQuery })
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults({ products: [], suggestions: [], query: searchQuery })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for debounced search
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    } else {
      setResults(null)
    }
  }, [debouncedQuery, performSearch])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
        setIsFocused(true)
      }
      if (event.key === "Escape") {
        setIsOpen(false)
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (searchQuery: string) => {
    saveRecentSearch(searchQuery)
    setIsOpen(false)
    setIsFocused(false)
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
  }
const handleCategory = (categorySlug: string) => {
  setIsOpen(false)
  setIsFocused(false)
  router.push(`/shop?categories=${encodeURIComponent(categorySlug)}`)
}

  const handleProductClick = (product: SearchProduct) => {
    saveRecentSearch(query)
    setIsOpen(false)
    setIsFocused(false)
    router.push(`/product/${product.slug}`)
  }

 const handleSuggestionClick = (suggestion: SearchSuggestion) => {
  setIsOpen(false)
  setIsFocused(false)

  if (suggestion.type === "category") {
    // Use category NAME (not slug) since that's what /shop expects
    router.push(`/shop?categories=${encodeURIComponent(suggestion.value)}`)
  } else {
    const searchQuery = suggestion.value
    setQuery(searchQuery)
    handleSearch(searchQuery)
  }
}



  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const getProductImages = (images: string) => {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed : [images]
    } catch {
      return [images]
    }
  }

  const addToCart = useCallback(
    (product: SearchProduct, e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const productImages = getProductImages(product.images)

      try {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: productImages[0] || "/placeholder.svg",
          quantity: 1,
        })

        toast.success(`${product.name} added to cart!`, {
          duration: 2000,
        })
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast.error("Failed to add item to cart")
      }
    },
    [addItem],
  )

  return (
    <div ref={searchRef} className="relative w-full max-w-[700px] lg:w-[700px] md:w-[500px] sm:w-[400px]">
      {/* Enhanced Search Input - Made Wider (600px) */}
      <div className="relative group">
        <div
          className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${
            isFocused ? "text-[#C53D39]" : "text-gray-400"
          }`}
        >
          <Search className="h-5 w-5" />
        </div>

        {/* Sparkle animation for premium feel */}
        <div
          className={`absolute inset-y-0 left-2 flex items-center pointer-events-none transition-all duration-500 ${
            isFocused ? "opacity-100 animate-pulse" : "opacity-0"
          }`}
        >
          <Sparkles className="h-3 w-3 text-[#C53D39]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsOpen(true)
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search premium furniture, brands, categories..."
          className={`w-full pl-12 pr-20 py-3.5 bg-gradient-to-r from-white via-gray-50 to-white border-2 transition-all duration-500 font-poppins text-sm shadow-lg hover:shadow-xl placeholder-gray-500 ${
            isFocused
              ? "border-[#C53D39] ring-4 ring-[#C53D39]/10 rounded-2xl bg-white"
              : "border-gray-200 hover:border-[#C53D39]/30 hover:ring-2 hover:ring-[#C53D39]/5 rounded-xl"
          }`}
        />

        {/* Enhanced right side controls */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setResults(null)
              }}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <div className="hidden sm:block">
            <kbd
              className={`px-2 py-1 text-xs border rounded-md shadow-sm transition-all duration-300 ${
                isFocused
                  ? "text-[#C53D39] bg-[#C53D39]/5 border-[#C53D39]/20"
                  : "text-gray-500 bg-white border-gray-300"
              }`}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Premium glow effect */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#C53D39]/5 via-transparent to-[#C53D39]/5 transition-opacity duration-300 pointer-events-none ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Enhanced Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-[85vh] overflow-hidden backdrop-blur-sm w-full">
          {/* Premium header gradient */}
          <div className="h-1 bg-gradient-to-r from-[#C53D39] via-[#E85A4F] to-[#C53D39]" />

          <div className="max-h-[85vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="p-6 text-center">
                <div className="relative">
                  <div className="w-8 h-8 border-3 border-[#C53D39]/20 border-t-[#C53D39] rounded-full animate-spin mx-auto mb-3"></div>
                  <div
                    className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-[#E85A4F] rounded-full animate-spin mx-auto opacity-60"
                    style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
                  ></div>
                </div>
                <p className="text-gray-600 text-sm font-medium">Searching premium furniture...</p>
                <p className="text-gray-400 text-xs mt-1">Finding the perfect pieces for you</p>
              </div>
            )}

            {/* No Query State - Show Recent Searches */}
            {!query && !isLoading && (
              <div className="p-6">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-[#C53D39]" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-gray-500 hover:text-[#C53D39] transition-colors font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-[#C53D39]/5 hover:to-transparent rounded-xl transition-all duration-200 text-sm text-gray-700 hover:text-[#C53D39] border border-transparent hover:border-[#C53D39]/10"
                        >
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-2 text-gray-400" />
                            {search}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="relative mb-4">
                      <Search className="w-16 h-16 text-gray-200 mx-auto" />
                      <Sparkles className="w-6 h-6 text-[#C53D39] absolute top-2 right-1/2 transform translate-x-8 animate-pulse" />
                    </div>
                    <h3 className="text-gray-700 font-semibold mb-2">Discover Premium Furniture</h3>
                    <p className="text-gray-500 text-sm mb-3">Start typing to explore our curated collection</p>
                    <div className="flex flex-wrap justify-center gap-2 text-xs">
                      {["sofa", "chair", "table", "bed"].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setQuery(suggestion)
                            handleSearch(suggestion)
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#C53D39]/10 to-[#E85A4F]/10 text-[#C53D39] rounded-full hover:from-[#C53D39]/20 hover:to-[#E85A4F]/20 transition-all duration-200 font-medium"
                        >
                          Try "{suggestion}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {query && results && !isLoading && (
              <>
                {/* Suggestions */}
                {results.suggestions.length > 0 && (
                  <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-gray-50/50 to-transparent">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-[#C53D39]" />
                      Smart Suggestions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 hover:border-[#C53D39] hover:bg-gradient-to-r hover:from-[#C53D39] hover:to-[#E85A4F] hover:text-white rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md group"
                        >
                          <span className="capitalize font-medium">{suggestion.type}:</span>
                          <span className="ml-1">{suggestion.value}</span>
                          <Badge
                            variant="secondary"
                            className="ml-2 text-xs group-hover:bg-white/20 group-hover:text-white"
                          >
                            {suggestion.product_count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {results.products.length > 0 ? (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-[#C53D39]" />
                        Premium Products ({results.products.length})
                      </h3>
                      <button
                        onClick={() => handleSearch(query)}
                        className="text-sm text-[#C53D39] hover:text-[#B12E2A] font-semibold hover:underline transition-all duration-200"
                      >
                        View all results →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {results.products.map((product) => {
                        const productImages = getProductImages(product.images)
                        const discount = product.compare_price
                          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                          : 0

                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="flex items-center p-4 hover:bg-gradient-to-r hover:from-[#C53D39]/5 hover:to-transparent rounded-xl cursor-pointer transition-all duration-200 group border border-transparent hover:border-[#C53D39]/10 hover:shadow-md"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 mr-4">
                              <Image
                                src={productImages[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                              />
                              {product.is_featured && (
                                <Badge className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-[#C53D39] to-[#E85A4F] px-1.5 py-0.5 shadow-sm">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate group-hover:text-[#C53D39] transition-colors text-sm mb-1">
                                {product.name}
                              </h4>
                              <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                {/* Render all categories (many-to-many) with fallback to category_name */}
                               {product.categories && product.categories.length > 0 ? (
  product.categories.map((cat) => (
    <span
      key={cat.id}
      onClick={(e) => {
        e.stopPropagation()
        handleCategory(cat.slug || cat.name)
      }}
      className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#C53D39]/10 hover:text-[#C53D39] transition-colors"
    >
      {cat.name}
    </span>
  ))
) : product.category_name ? (
  <span
    onClick={(e) => {
      e.stopPropagation()
      handleCategory(product.category_name!)
    }}
    className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#C53D39]/10 hover:text-[#C53D39] transition-colors"
  >
    {product.category_name}
  </span>
) : null}

                                {product.brand && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {product.brand}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs text-gray-600 ml-1 font-medium">
                                    {product.average_rating.toFixed(1)} ({product.review_count})
                                  </span>
                                </div>
                                {product.stock_quantity > 0 ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-200 bg-green-50"
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50">
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
                                {product.compare_price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.compare_price)}
                                  </span>
                                )}
                              </div>
                              {discount > 0 && (
                                <Badge className="mb-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-0.5 shadow-sm">
                                  -{discount}% OFF
                                </Badge>
                              )}
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleProductClick(product)
                                  }}
                                  className="p-1.5 h-7 w-7 border-[#C53D39]/20 hover:border-[#C53D39] hover:bg-[#C53D39]/5"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                {product.stock_quantity > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => addToCart(product, e)}
                                    className="p-1.5 h-7 w-7 bg-gradient-to-r from-[#C53D39] to-[#E85A4F] hover:from-[#B12E2A] hover:to-[#D74B3F] shadow-sm hover:shadow-md"
                                  >
                                    <ShoppingCart className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : query && !isLoading ? (
                  <div className="p-8 text-center">
                    <div className="relative mb-4">
                      <Search className="w-16 h-16 text-gray-200 mx-auto" />
                      <X className="w-6 h-6 text-red-400 absolute top-2 right-1/2 transform translate-x-8" />
                    </div>
                    <h3 className="text-gray-700 font-semibold mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm mb-4">We couldn't find any products matching "{query}"</p>
                    <div className="space-y-2 text-xs text-gray-400">
                      <p>• Try different or more general keywords</p>
                      <p>• Check your spelling</p>
                      <p>• Browse our categories instead</p>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
