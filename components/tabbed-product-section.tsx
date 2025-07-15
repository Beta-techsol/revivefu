"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"

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
  is_deal_of_day: boolean
  is_hot_selling: boolean
  is_latest: boolean
  average_rating: number
  review_count: number
  stock_quantity: number
}

const tabs = [
  { id: "deals", label: "Deals of the Day", key: "is_deal_of_day" },
  { id: "latest", label: "Latest Products", key: "is_latest" },
  { id: "trending", label: "Trending", key: "is_trending" },
  { id: "hot", label: "Hot Selling", key: "is_hot_selling" },
  { id: "featured", label: "Featured", key: "is_featured" },
  { id: "bestseller", label: "Best Sellers", key: "is_best_seller" },
]

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("deals")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async (tab: string) => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching products for tab:", tab)

      const response = await fetch(`/api/products/random?tab=${tab}&limit=8`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch products")
      }

      setProducts(data.products || [])
      console.log("Products fetched successfully for tab:", tab, data.products?.length || 0)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(activeTab)
  }, [activeTab])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Error loading products: {error}</p>
              <Button onClick={() => fetchProducts(activeTab)} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated selection of premium furniture pieces
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => handleTabChange(tab.id)}
              className="text-sm"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
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
              <p className="text-gray-600 mb-4">No products available for this category at the moment.</p>
              <Button onClick={() => fetchProducts(activeTab)} variant="outline">
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
