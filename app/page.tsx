"use client"

import { useState, useEffect } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { FeaturesSection } from "@/components/features-section"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { CircularCategories } from "@/components/circular-categories"
import { ProductShowcase } from "@/components/product-showcase"
import { ProductCarousel } from "@/components/product-carousel"
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
  images: string | string[]
  description?: string
  short_description?: string
  average_rating?: number
  review_count?: number
  is_featured?: boolean
  is_trending?: boolean
  is_best_seller?: boolean
  is_hot_selling?: boolean
  is_deal_of_day?: boolean
  is_latest?: boolean
  room_type?: string
  stock_quantity?: number
}

// Simple ShopByRoom component to avoid import issues
const ShopByRoom = ({
  livingRoomProducts = [],
  bedroomProducts = [],
  diningRoomProducts = [],
  officeProducts = [],
}: {
  livingRoomProducts?: any[]
  bedroomProducts?: any[]
  diningRoomProducts?: any[]
  officeProducts?: any[]
}) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Room</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Find the perfect furniture for every space in your home</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Living Room</h3>
              <p className="text-gray-600 text-sm">{livingRoomProducts.length} products</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Bedroom</h3>
              <p className="text-gray-600 text-sm">{bedroomProducts.length} products</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Dining Room</h3>
              <p className="text-gray-600 text-sm">{diningRoomProducts.length} products</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Office</h3>
              <p className="text-gray-600 text-sm">{officeProducts.length} products</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
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
      if (data && data.success && Array.isArray(data.products)) {
        setProducts(data.products)
      } else if (data && Array.isArray(data.products)) {
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

  // Transform products for component compatibility with safe defaults
  const transformProduct = (product: Product) => {
    if (!product || !product.id) return null

    // Safely handle images
    let productImages: string[] = []
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images)
        productImages = Array.isArray(parsed) ? parsed : [product.images]
      } catch {
        productImages = [product.images]
      }
    } else if (Array.isArray(product.images)) {
      productImages = product.images
    }

    return {
      id: product.id,
      name: product.name || "Untitled Product",
      price: product.price || 0,
      originalPrice: product.compare_price || undefined,
      image: productImages.length > 0 ? productImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage:
        productImages.length > 1 ? productImages[1] : productImages[0] || "/placeholder.svg?height=400&width=400",
      description: product.short_description || product.description || "",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      isOnSale: !!(product.compare_price && product.compare_price > (product.price || 0)),
      isSoldOut: (product.stock_quantity || 0) === 0,
      discount:
        product.compare_price && product.price
          ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
          : 0,
    }
  }

  // Filter products by category with safe filtering
  const safeProducts = products.filter((p) => p && p.id)

  const featuredProducts = safeProducts
    .filter((p) => p.is_featured)
    .map(transformProduct)
    .filter(Boolean)

  const trendingProducts = safeProducts
    .filter((p) => p.is_trending)
    .map(transformProduct)
    .filter(Boolean)

  const bestSellerProducts = safeProducts
    .filter((p) => p.is_best_seller)
    .map(transformProduct)
    .filter(Boolean)

  const hotSellingProducts = safeProducts
    .filter((p) => p.is_hot_selling)
    .map(transformProduct)
    .filter(Boolean)

  const dealOfDayProducts = safeProducts
    .filter((p) => p.is_deal_of_day)
    .map(transformProduct)
    .filter(Boolean)

  const latestProducts = safeProducts
    .filter((p) => p.is_latest)
    .map(transformProduct)
    .filter(Boolean)

  // Room-based products with safe filtering
  const livingRoomProducts = safeProducts
    .filter((p) => p.room_type === "living_room")
    .map(transformProduct)
    .filter(Boolean)

  const bedroomProducts = safeProducts
    .filter((p) => p.room_type === "bedroom")
    .map(transformProduct)
    .filter(Boolean)

  const diningRoomProducts = safeProducts
    .filter((p) => p.room_type === "dining_room")
    .map(transformProduct)
    .filter(Boolean)

  const officeProducts = safeProducts
    .filter((p) => p.room_type === "office")
    .map(transformProduct)
    .filter(Boolean)

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

      {/* Shop by Room */}
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
