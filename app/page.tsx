import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { ProductCarousel } from "@/components/product-carousel"
{/*import { HotspotHeroSection } from "@/components/hotspot-hero-section"*/}
{/*import { FurnitureShowcaseSection } from "@/components/furniture-showcase-section"*/}
import { FeaturesSection } from "@/components/features-section"
{/*import { RoomShowcaseSection } from "@/components/room-showcase-section"*/}
import { ArticlesBlogs } from "@/components/articles-blogs"
import { CommitmentExcellenceSection } from "@/components/commitment-excellence-section"
import { VideoShowcaseSection } from "@/components/video-showcase-section"
import { MinimalistArmchairSection } from "@/components/minimalist-armchair-section"
{/*import { ShopByRoom } from "@/components/shop-by-room"*/}
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { MostPopularProducts } from "@/components/most-popular-products"
{/*import { ShopTheLookSection } from "@/components/shop-the-look-section"*/}
import { NewArrivalsSection } from "@/components/new-arrivals-section"
import { OurClients } from "@/components/our-clients"
import { TestimonialsSection } from "@/components/testimonials-section"
{/*import { FlashSaleSection } from "@/components/flash-sale-section"*/}
import { FaqSection } from "@/components/faq-section"
import { InstagramFollow } from "@/components/instagram-follow"
{/*import { CuratedPicksSection } from "@/components/curated-picks-section"/}
import { FurnitureShowcaseFooter } from "@/components/furniture-showcase-footer"

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
      {/*<ShopTheLookSection />*/}
      {/*<FlashSaleSection />*/}
      <NewArrivalsSection />
     {/* <HotspotHeroSection />*/}
      {/*<ShopByRoom />*/}
      {/*<FurnitureShowcaseSection/>*/}
      <MinimalistArmchairSection />
      <OurClients />
      <InstagramFollow/>
      {/*<RoomShowcaseSection/>*/}
      <TestimonialsSection />
      {/*<CuratedPicksSection />/}
       <FaqSection />
      <ArticlesBlogs />
      <FurnitureShowcaseFooter/>
    </main>
  )
}
