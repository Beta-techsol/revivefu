"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import { ProductDetails } from "@/components/product/product-details"
import { ProductTabs } from "@/components/product/product-tabs"
import { ProductCarousel } from "@/components/product-carousel"
import { StickyCartBar } from "@/components/product/sticky-cart-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  description: string
  short_description: string
  sku: string
  status: string
  stock_quantity: number
  images: string[]
  tags: string[]
  material: string
  color: string
  brand: string
  average_rating: number
  review_count: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  room_type_id: string
  room_type: string
  created_at: string
  updated_at: string
  category_name: string
  category_slug: string
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching product with ID:", params.id)

      const response = await fetch(`/api/products/${params.id}`)

      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch product")
      }

      setProduct(data.product)
      console.log("Product fetched successfully:", data.product?.name)
    } catch (error) {
      console.error("Error fetching product:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">Error loading product: {error}</p>
            <Button onClick={fetchProduct} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-4" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-12">
          <div className="flex space-x-4 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ProductImageGallery
            images={Array.isArray(product.images) ? product.images : JSON.parse(product.images || "[]")}
            productName={product.name}
          />
          <ProductDetails product={product} />
        </div>

        {/* Product Information Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <ProductCarousel
          title="Related Products"
          subtitle="You might also like these products"
          tab="featured"
          limit={8}
          className="bg-gray-50"
        />

        {/* Sticky Cart Bar for Mobile */}
        <StickyCartBar product={product} />
      </div>
    </div>
  )
}
