import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureShowcaseSection } from "@/components/furniture-showcase-section"
import { PromotionalBanners } from "@/components/promotional-banners"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { MainCategories } from "@/components/main-categories"
import { CircularCategories } from "@/components/circular-categories"
import { ShopByRoom } from "@/components/shop-by-room"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { ProductShowcase } from "@/components/product-showcase"
import { ScrollNavigation } from "@/components/scroll-navigation"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { OurClients } from "@/components/our-clients"
import { InstagramFollow } from "@/components/instagram-follow"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Furniture Showcase Section */}
      <FurnitureShowcaseSection />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Furniture Categories Grid */}
      <FurnitureCategoriesGrid />

      {/* Tabbed Product Section */}
      <TabbedProductSection />

      {/* Main Categories */}
      <MainCategories />

      {/* Circular Categories */}
      <CircularCategories />

      {/* Shop by Room */}
      <ShopByRoom />

      {/* Gaming Chairs Banner */}
      <GamingChairsBanner />

      {/* Product Showcase */}
      <ProductShowcase />

      {/* Scroll Navigation */}
      <ScrollNavigation />

      {/* Articles & Blogs */}
      <ArticlesBlogs />

      {/* Our Clients */}
      <OurClients />

      {/* Instagram Follow */}
      <InstagramFollow />
    </main>
  )
}
