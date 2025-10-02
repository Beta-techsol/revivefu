import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { ProductCarousel } from "@/components/product-carousel"
{
  /*import { HotspotHeroSection } from "@/components/hotspot-hero-section"*/
}
{
  /*import { FurnitureShowcaseSection } from "@/components/furniture-showcase-section"*/
}
import { FeaturesSection } from "@/components/features-section"
{
  /*import { RoomShowcaseSection } from "@/components/room-showcase-section"*/
}
import { ArticlesBlogs } from "@/components/articles-blogs"
import { CommitmentExcellenceSection } from "@/components/commitment-excellence-section"
import { VideoShowcaseSection } from "@/components/video-showcase-section"
import { MinimalistArmchairSection } from "@/components/minimalist-armchair-section"
{
  /*import { ShopByRoom } from "@/components/shop-by-room"*/
}
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { MostPopularProducts } from "@/components/most-popular-products"
{
  /*import { ShopTheLookSection } from "@/components/shop-the-look-section"*/
}
import { NewArrivalsSection } from "@/components/new-arrivals-section"
import { OurClients } from "@/components/our-clients"
import { TestimonialsSection } from "@/components/testimonials-section"
{
  /*import { FlashSaleSection } from "@/components/flash-sale-section"*/
}
import { FaqSection } from "@/components/faq-section"
import { InstagramFollow } from "@/components/instagram-follow"
{
  /*import { CuratedPicksSection } from "@/components/curated-picks-section"*/
}
import { FurnitureShowcaseFooter } from "@/components/furniture-showcase-footer"

export default async function Home() {
  // We use the public products API and exclude_ids to guarantee no overlap.
  const fetchJson = async (path: string) => {
    const res = await fetch(path, { cache: "no-store" })
    if (!res.ok) return { products: [] as any[] }
    return res.json()
  }

  const newArrivalsData = await fetchJson(`/api/products?limit=9`)
  const newArrivalIds: string[] = (newArrivalsData.products || []).map((p: any) => String(p.id))

  const trendingData = await fetchJson(
    `/api/products?limit=20&tab=trending${
      newArrivalIds.length ? `&exclude_ids=${encodeURIComponent(newArrivalIds.join(","))}` : ""
    }`,
  )
  const trendingIds: string[] = (trendingData.products || []).map((p: any) => String(p.id))
  const excludeForPopular = [...new Set([...newArrivalIds, ...trendingIds])]

  const mostPopularData = await fetchJson(
    `/api/products?limit=9&tab=carousel${
      excludeForPopular.length ? `&exclude_ids=${encodeURIComponent(excludeForPopular.join(","))}` : ""
    }`,
  )

  return (
    <main className="min-h-screen">
      <HeroCarousel />
      <FeaturesSection />
      <FurnitureCategoriesGrid />
      <TabbedProductSection />
      <CommitmentExcellenceSection />
      <ProductCarousel prefetched={trendingData.products || []} />
      <VideoShowcaseSection />
      <MostPopularProducts prefetched={mostPopularData.products || []} />
      <NewArrivalsSection prefetched={newArrivalsData.products || []} />
      <MinimalistArmchairSection />
      <OurClients />
      <InstagramFollow />
      <TestimonialsSection />
      <FaqSection />
      <ArticlesBlogs />
      <FurnitureShowcaseFooter />
    </main>
  )
}
