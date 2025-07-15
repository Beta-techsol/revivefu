"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { MainCategories } from "@/components/main-categories"
import { ProductShowcase } from "@/components/product-showcase"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { FeaturesSection } from "@/components/features-section"
import { OfficeBannerSection } from "@/components/office-banner-section"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { OurClients } from "@/components/our-clients"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { InstagramFollow } from "@/components/instagram-follow"
import { MovingTextBanner } from "@/components/moving-text-banner"

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
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=50")
      const data = await response.json()

      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products)
      } else {
        console.error("Failed to fetch products:", data.error)
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Transform products for component compatibility
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
      name: product.name || "Untitled Product",
      price: product.price || 0,
      originalPrice: product.compare_price,
      image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage: productImages.length > 1 ? productImages[1] : productImages[0],
      description: product.short_description || product.description || "",
      rating: product.average_rating || 0,
      isOnSale: !!product.compare_price && product.compare_price > product.price,
      isSoldOut: product.stock_quantity === 0,
      discount: product.compare_price
        ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
        : 0,
      category: product.category_name || "",
      brand: product.brand || "",
    }
  }

  // Filter products by type with null checks
  const featuredProducts = products
    .filter((product) => product && product.is_featured)
    .slice(0, 8)
    .map(transformProduct)

  const trendingProducts = products
    .filter((product) => product && product.is_trending)
    .slice(0, 8)
    .map(transformProduct)

  const bestSellerProducts = products
    .filter((product) => product && product.is_best_seller)
    .slice(0, 8)
    .map(transformProduct)

  const hotSellingProducts = products
    .filter((product) => product && product.is_hot_selling)
    .slice(0, 8)
    .map(transformProduct)

  const dealOfDayProducts = products
    .filter((product) => product && product.is_deal_of_day)
    .slice(0, 8)
    .map(transformProduct)

  const latestProducts = products
    .filter((product) => product && product.is_latest)
    .slice(0, 8)
    .map(transformProduct)

  // Fallback to all products if specific categories are empty
  const allTransformedProducts = products
    .filter((product) => product && product.name)
    .slice(0, 8)
    .map(transformProduct)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Moving Text Banner */}
      <MovingTextBanner />

      {/* Main Categories */}
      <MainCategories />

      {/* Product Showcase */}
      <ProductShowcase products={featuredProducts.length > 0 ? featuredProducts : allTransformedProducts} />

      {/* Tabbed Product Section */}
      <TabbedProductSection
        featuredProducts={featuredProducts.length > 0 ? featuredProducts : allTransformedProducts}
        trendingProducts={trendingProducts.length > 0 ? trendingProducts : allTransformedProducts}
        bestSellerProducts={bestSellerProducts.length > 0 ? bestSellerProducts : allTransformedProducts}
        hotSellingProducts={hotSellingProducts.length > 0 ? hotSellingProducts : allTransformedProducts}
        dealOfDayProducts={dealOfDayProducts.length > 0 ? dealOfDayProducts : allTransformedProducts}
        latestProducts={latestProducts.length > 0 ? latestProducts : allTransformedProducts}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Office Banner Section */}
      <OfficeBannerSection />

      {/* Gaming Chairs Banner */}
      <GamingChairsBanner />

      {/* Our Clients */}
      <OurClients />

      {/* Articles & Blogs */}
      <ArticlesBlogs />

      {/* Instagram Follow */}
      <InstagramFollow />
    </div>
  )
}
