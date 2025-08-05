import HeroCarousel from "@/components/hero-carousel"
import FurnitureCategoriesGrid from "@/components/furniture-categories-grid"
import TabbedProductSection from "@/components/tabbed-product-section"
import FurnitureShowcaseSection from "@/components/furniture-showcase-section"
import InteractiveHotspotBanner from "@/components/interactive-hotspot-banner"
import ProductCarousel from "@/components/product-carousel"
import GamingChairsBanner from "@/components/gaming-chairs-banner"
import VideoShowcaseSection from "@/components/video-showcase-section"
import ShopByRoom from "@/components/shop-by-room"
import CircularCategories from "@/components/circular-categories"
import MainCategories from "@/components/main-categories"
import OurClients from "@/components/our-clients"
import InstagramFollow from "@/components/instagram-follow"
import PromotionalBanners from "@/components/promotional-banners"
import RevitalizeSection from "@/components/revitalize-section"
import RoomShowcaseSection from "@/components/room-showcase-section"
import HotspotHeroSection from "@/components/hotspot-hero-section"
import FeaturesSection from "@/components/features-section"

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Features Section */}
      <FeaturesSection />

      {/* Furniture Categories Grid */}
      <FurnitureCategoriesGrid />

      {/* Tabbed Product Section */}
      <TabbedProductSection />

      {/* Furniture Showcase Section */}
      <FurnitureShowcaseSection />

      {/* Interactive Hotspot Banner */}
      <InteractiveHotspotBanner />

      {/* Product Carousel */}
      <ProductCarousel />

      {/* Gaming Chairs Banner */}
      <GamingChairsBanner />

      {/* Video Showcase Section - Added under gaming chairs */}
      <VideoShowcaseSection />

      {/* Shop by Room */}
      <ShopByRoom />

      {/* Circular Categories */}
      <CircularCategories />

      {/* Main Categories */}
      <MainCategories />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Our Clients */}
      <OurClients />

      {/* Instagram Follow */}
      <InstagramFollow />

      {/* Revitalize Section */}
      <RevitalizeSection />

      {/* Room Showcase Section */}
      <RoomShowcaseSection />

      {/* Hotspot Hero Section */}
      <HotspotHeroSection />
    </main>
  )
}
