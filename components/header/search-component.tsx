"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, Clock, TrendingUp, Star, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchProduct {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string
  category_name: string
  material: string
  color: string
  brand: string
  average_rating: number
  review_count: number
  stock_quantity: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  room_type_name: string
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
      }
      if (event.key === "Escape") {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (searchQuery: string) => {
    saveRecentSearch(searchQuery)
    setIsOpen(false)
    router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
  }

  const handleProductClick = (product: SearchProduct) => {
    saveRecentSearch(query)
    setIsOpen(false)
    router.push(`/product/${product.id}`)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const searchQuery = suggestion.value
    setQuery(searchQuery)
    handleSearch(searchQuery)
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

  const addToCart = (product: SearchProduct, e: React.MouseEvent) => {
    e.stopPropagation()
    const productImages = getProductImages(product.images)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0] || "/placeholder.svg",
      quantity: 1,
    })
  }

  return (
    <div ref={searchRef} className="relative w-80">
      {/* Search Input - Compact for secondary header */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search premium furniture..."
          className="w-full pl-10 pr-16 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C53D39] focus:border-[#C53D39] transition-all duration-300 font-poppins text-sm shadow-sm hover:shadow-md placeholder-gray-500"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          {query && (
            <button
              onClick={() => {
                setQuery("")
                setResults(null)
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <div className="hidden sm:block">
            <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-white border border-gray-300 rounded shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden">
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="w-5 h-5 border-2 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Searching...</p>
              </div>
            )}

            {/* No Query State - Show Recent Searches */}
            {!query && !isLoading && (
              <div className="p-4">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-700 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Recent Searches
                      </h3>
                      <button onClick={clearRecentSearches} className="text-xs text-gray-500 hover:text-gray-700">
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                          className="w-full text-left px-2 py-1.5 hover:bg-gray-50 rounded-md transition-colors text-xs text-gray-700"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">Start typing to search</p>
                    <p className="text-gray-400 text-xs mt-1">Try "sofa", "chair", or "table"</p>
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {query && results && !isLoading && (
              <>
                {/* Suggestions */}
                {results.suggestions.length > 0 && (
                  <div className="border-b border-gray-100 p-3">
                    <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Suggestions
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {results.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-[#C53D39] hover:text-white rounded-full text-xs transition-colors"
                        >
                          <span className="capitalize">{suggestion.type}:</span>
                          <span className="ml-1 font-medium">{suggestion.value}</span>
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {suggestion.product_count}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {results.products.length > 0 ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-gray-700">Products ({results.products.length})</h3>
                      <button
                        onClick={() => handleSearch(query)}
                        className="text-xs text-[#C53D39] hover:text-[#B12E2A] font-medium"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {results.products.map((product) => {
                        const productImages = getProductImages(product.images)
                        const discount = product.compare_price
                          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                          : 0

                        return (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                          >
                            <div className="relative w-12 h-12 flex-shrink-0 mr-3">
                              <Image
                                src={productImages[0] || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover rounded-md"
                              />
                              {product.is_featured && (
                                <Badge className="absolute -top-1 -right-1 text-xs bg-[#C53D39] px-1 py-0">New</Badge>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate group-hover:text-[#C53D39] transition-colors text-sm">
                                {product.name}
                              </h4>
                              <div className="flex items-center space-x-1 mt-0.5">
                                <span className="text-xs text-gray-500">{product.category_name}</span>
                                {product.brand && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-xs text-gray-500">{product.brand}</span>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <div className="flex items-center">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                  <span className="text-xs text-gray-600 ml-0.5">
                                    {product.average_rating.toFixed(1)} ({product.review_count})
                                  </span>
                                </div>
                                {product.stock_quantity > 0 ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-green-600 border-green-200 px-1 py-0"
                                  >
                                    In Stock
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs text-red-600 border-red-200 px-1 py-0">
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
                                {product.compare_price && (
                                  <span className="text-xs text-gray-500 line-through">
                                    {formatPrice(product.compare_price)}
                                  </span>
                                )}
                              </div>
                              {discount > 0 && (
                                <Badge className="mt-0.5 bg-red-100 text-red-700 text-xs px-1 py-0">-{discount}%</Badge>
                              )}
                              <div className="flex items-center space-x-0.5 mt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleProductClick(product)
                                  }}
                                  className="p-0.5 h-6 w-6"
                                >
                                  <Eye className="w-2.5 h-2.5" />
                                </Button>
                                {product.stock_quantity > 0 && (
                                  <Button
                                    size="sm"
                                    onClick={(e) => addToCart(product, e)}
                                    className="p-0.5 h-6 w-6 bg-[#C53D39] hover:bg-[#B12E2A]"
                                  >
                                    <ShoppingCart className="w-2.5 h-2.5" />
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
                  <div className="p-4 text-center">
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-xs">No products found for "{query}"</p>
                    <p className="text-gray-400 text-xs mt-1">Try different keywords</p>
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
