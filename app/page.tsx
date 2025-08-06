import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { ProductCarousel } from "@/components/product-carousel"
import { HotspotHeroSection } from "@/components/hotspot-hero-section"
import { FeaturesSection } from "@/components/features-section"
import { ArticlesBlogs } from "@/components/articles-blogs"
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
import { FaqSection } from "@/components/faq-section"
import { CuratedPicksSection } from "@/components/curated-picks-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <FeaturesSection />
      <FurnitureCategoriesGrid />
      <TabbedProductSection />
      <CommitmentExcellenceSection />
      <ProductCarousel />
      <VideoShowcaseSection />
      <MostPopularProducts />
      <ShopTheLookSection />
      <HotspotHeroSection />
      <MinimalistArmchairSection />
      <ShopByRoom />
      <NewArrivalsSection />
      <OurClients />
      <TestimonialsSection />
      <ScrollRevealShowcase />
      <FlashSaleSection />
      <FaqSection />
      <CuratedPicksSection />
      <ArticlesBlogs />
    </main>
  )
}
