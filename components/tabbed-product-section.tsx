"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url: string
  rating?: number
  reviews_count?: number
  discount_percentage?: number
  description?: string
  category?: string
  material?: string
  color?: string
  brand?: string
  in_stock?: boolean
}

const tabs = [
  { id: "best-sellers", label: "Best Sellers", endpoint: "/api/products?limit=8&sort=best_sellers" },
  { id: "new-arrivals", label: "New Arrivals", endpoint: "/api/products?limit=8&sort=newest" },
  { id: "featured", label: "Featured", endpoint: "/api/products?limit=8&sort=featured" },
  { id: "on-sale", label: "On Sale", endpoint: "/api/products?limit=8&sort=on_sale" },
]

export function TabbedProductSection() {
  const [activeTab, setActiveTab] = useState("best-sellers")
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const fetchProducts = async (tabId: string, endpoint: string) => {
    if (products[tabId]) return // Already loaded

    setLoading((prev) => ({ ...prev, [tabId]: true }))
    try {
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setProducts((prev) => ({ ...prev, [tabId]: data.products || [] }))
      }
    } catch (error) {
      console.error(`Error fetching ${tabId} products:`, error)
    } finally {
      setLoading((prev) => ({ ...prev, [tabId]: false }))
    }
  }

  useEffect(() => {
    // Load best sellers by default
    fetchProducts("best-sellers", "/api/products?limit=8&sort=best_sellers")
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      fetchProducts(tabId, tab.endpoint)
    }
  }

  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    image: product.image_url,
    rating: product.rating || 5,
    reviews: product.reviews_count || 0,
    description: product.description,
    category: product.category,
    material: product.material,
    color: product.color,
    brand: product.brand,
    inStock: product.in_stock !== false,
    isOnSale: product.original_price ? product.original_price > product.price : false,
    discount:
      product.original_price && product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : product.discount_percentage || 0,
  })

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              {loading[tab.id] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                      <div className="bg-gray-200 h-4 rounded mb-2"></div>
                      <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(products[tab.id] || []).map((product) => (
                    <ProductCard key={product.id} product={transformProduct(product)} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
