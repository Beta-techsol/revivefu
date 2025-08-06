import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { CuratedPicksSection } from "@/components/curated-picks-section"
import { ProductShowcase } from "@/components/product-showcase"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { CircularCategories } from "@/components/circular-categories"
import { MainCategories } from "@/components/main-categories"
import { PromotionalBanners } from "@/components/promotional-banners"
import { FurnitureShowcaseSection } from "@/components/furniture-showcase-section"
import { InteractiveHotspotBanner } from "@/components/interactive-hotspot-banner"
import { RevitalizeSection } from "@/components/revitalize-section"
import { CommitmentExcellenceSection } from "@/components/commitment-excellence-section"
import { VideoShowcaseSection } from "@/components/video-showcase-section"
import { MinimalistArmchairSection } from "@/components/minimalist-armchair-section"
import { ShopByRoom } from "@/components/shop-by-room"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { MostPopularProducts } from "@/components/most-popular-products"
import { ShopTheLookSection } from "@/components/shop-the-look-section"
import { NewArrivalsSection } from "@/components/new-arrivals-section"
import { OurClients } from "@/components/our-clients"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ScrollRevealShowcase } from "@/components/scroll-reveal-showcase"
import { FlashSaleSection } from "@/components/flash-sale-section"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { FaqSection } from "@/components/faq-section"
import { InstagramFollow } from "@/components/instagram-follow"
import { FurnitureShowcaseFooter } from "@/components/furniture-showcase-footer"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <FurnitureCategoriesGrid />
      <CuratedPicksSection />
      <ProductShowcase />
      <GamingChairsBanner />
      <CircularCategories />
      <MainCategories />
      <PromotionalBanners />
      <FurnitureShowcaseSection />
      <InteractiveHotspotBanner />
      <RevitalizeSection />
      <CommitmentExcellenceSection />
      <VideoShowcaseSection />
      <MinimalistArmchairSection />
      <ShopByRoom />
      <TabbedProductSection />
      <MostPopularProducts />
      <ShopTheLookSection />
      <NewArrivalsSection />
      <OurClients />
      <TestimonialsSection />
      <ScrollRevealShowcase />
      <FlashSaleSection />
      <FeaturesSection />
      <ArticlesBlogs />
      <FaqSection />
      <InstagramFollow />
      <FurnitureShowcaseFooter />
    </main>
  )
}
