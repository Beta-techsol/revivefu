"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturesSection } from "@/components/features-section"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { CircularCategories } from "@/components/circular-categories"
import { ProductShowcase } from "@/components/product-showcase"
import { ProductCarousel } from "@/components/product-carousel"
import { ShopByRoom } from "@/components/shop-by-room"
import { OfficeBannerSection } from "@/components/office-banner-section"
import { OurClients } from "@/components/our-clients"
import { MainCategories } from "@/components/main-categories"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { InstagramFollow } from "@/components/instagram-follow"
import { ScrollNavigation } from "@/components/scroll-navigation"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { FurnitureShowcaseFooter } from "@/components/furniture-showcase-footer"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  images: string[]
  description: string
  short_description: string
  average_rating: number
  review_count: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  room_type: string
  stock_quantity: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=50")
      const data = await response.json()

      // Handle both success response format and direct products array
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

  // Transform products for component compatibility
  const transformProduct = (product: Product) => {
    // Safely handle images array
    const productImages = Array.isArray(product.images)
      ? product.images
      : typeof product.images === "string"
        ? [product.images]
        : []

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
    }
  }

  // Filter products by category - with null checks
  const featuredProducts = products.filter((p) => p?.is_featured).map(transformProduct)
  const trendingProducts = products.filter((p) => p?.is_trending).map(transformProduct)
  const bestSellerProducts = products.filter((p) => p?.is_best_seller).map(transformProduct)
  const hotSellingProducts = products.filter((p) => p?.is_hot_selling).map(transformProduct)
  const dealOfDayProducts = products.filter((p) => p?.is_deal_of_day).map(transformProduct)
  const latestProducts = products.filter((p) => p?.is_latest).map(transformProduct)

  // Room-based products - with null checks
  const livingRoomProducts = products.filter((p) => p?.room_type === "living_room").map(transformProduct)
  const bedroomProducts = products.filter((p) => p?.room_type === "bedroom").map(transformProduct)
  const diningRoomProducts = products.filter((p) => p?.room_type === "dining_room").map(transformProduct)
  const officeProducts = products.filter((p) => p?.room_type === "office").map(transformProduct)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <FeaturesSection />
      <TabbedProductSection />
      <CircularCategories />
      <ProductShowcase />

      {/* Best Seller Products */}
      {bestSellerProducts.length > 0 && (
        <main className="container mx-auto px-4 py-8" id="products-section">
          <ProductCarousel
            products={bestSellerProducts}
            title="Best Seller Products"
            subtitle="Discover our most popular furniture pieces that combine style, comfort, and quality craftsmanship"
          />
        </main>
      )}

      {/* Deal of the Day */}
      {dealOfDayProducts.length > 0 && (
        <main className="container mx-auto px-4 py-8">
          <ProductCarousel
            products={dealOfDayProducts}
            title="Deal of the Day"
            subtitle="Limited time offers on premium furniture pieces"
          />
        </main>
      )}

      {/* Latest Furniture */}
      {latestProducts.length > 0 && (
        <main className="container mx-auto px-4 py-8">
          <ProductCarousel
            products={latestProducts}
            title="Latest Furniture"
            subtitle="Explore our newest arrivals and contemporary designs"
          />
        </main>
      )}

      {/* Trending Furniture */}
      {trendingProducts.length > 0 && (
        <main className="container mx-auto px-4 py-8">
          <ProductCarousel
            products={trendingProducts}
            title="Trending Furniture"
            subtitle="What's popular right now in furniture design"
          />
        </main>
      )}

      {/* Hot Selling */}
      {hotSellingProducts.length > 0 && (
        <main className="container mx-auto px-4 py-8">
          <ProductCarousel
            products={hotSellingProducts}
            title="Hot Selling"
            subtitle="Fast-moving items that customers love"
          />
        </main>
      )}

      <GamingChairsBanner />

      {/* Shop by Room - pass room-specific products */}
      <ShopByRoom
        livingRoomProducts={livingRoomProducts}
        bedroomProducts={bedroomProducts}
        diningRoomProducts={diningRoomProducts}
        officeProducts={officeProducts}
      />

      <MainCategories />
      <OfficeBannerSection />
      <OurClients />
      <InstagramFollow />
      <ArticlesBlogs />
      <FurnitureShowcaseFooter />
      <ScrollNavigation />
    </div>
  )
}
