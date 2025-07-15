"use client"

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



export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <FeaturesSection />
      <TabbedProductSection />
      <CircularCategories />
      <ProductShowcase />
      <main className="container mx-auto px-4 py-8" id="products-section">
        <ProductCarousel
          products={products}
          title="Best Seller Products"
          subtitle="Discover our most popular furniture pieces that combine style, comfort, and quality craftsmanship"
        />
      </main>
      <GamingChairsBanner />
      <ShopByRoom />
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
