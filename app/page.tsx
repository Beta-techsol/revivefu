"use client"

import { Header } from "@/components/header"
import { MainCategories } from "@/components/main-categories"
import { FeaturesSection } from "@/components/features-section"
import { OurClients } from "@/components/our-clients"
import { InstagramFollow } from "@/components/instagram-follow"
import { Footer } from "@/components/footer"
import { MovingTextBanner } from "@/components/moving-text-banner"
import { OfficeBannerSection } from "@/components/office-banner-section"
import { ScrollAnimation } from "@/components/scroll-animation"
import { ProductCarousel } from "@/components/product-carousel"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { ProductShowcase } from "@/components/product-showcase"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { ShopByRoom } from "@/components/shop-by-room"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { CircularCategories } from "@/components/circular-categories"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductsSlider } from "@/components/products-slider"

export default function HomePage() {
  return (
    <>
      <style jsx global>{`
        /* Mobile touch-friendly hover effects */
        @media (hover: none) and (pointer: coarse) {
          .hover\\:scale-105:active {
            transform: scale(1.05);
          }
          
          .hover\\:shadow-xl:active {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          
          .hover\\:bg-gray-50:active {
            background-color: #f9fafb;
          }
          
          .hover\\:text-\\[\\#C53D39\\]:active {
            color: #C53D39;
          }
          
          .group:active .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
          
          .group:active .group-hover\\:opacity-100 {
            opacity: 1;
          }
          
          .group:active .group-hover\\:translate-y-0 {
            transform: translateY(0);
          }
          
          /* Ensure minimum touch target size */
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Smooth touch scrolling */
          * {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Touch feedback for interactive elements */
          .hover\\:bg-gradient-to-r:active {
            background: linear-gradient(to right, #B12E2A, #D74B3F);
          }
          
          /* Product card touch effects */
          .product-card:active {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
          
          /* Banner touch effects */
          .banner-item:active {
            transform: scale(1.02);
          }
          
          /* Category card touch effects */
          .category-card:active {
            transform: translateY(-4px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
          }
        }
        
        /* Enhanced touch targets for mobile */
        @media (max-width: 768px) {
          button, a[role="button"], .clickable {
            padding: 12px;
            margin: 4px;
          }
          
          /* Larger tap areas for small elements */
          .tap-target {
            position: relative;
          }
          
          .tap-target::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            z-index: -1;
          }
        }
        
        /* Prevent text selection on touch */
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Smooth transitions for all interactive elements */
        .interactive {
          transition: all 0.2s ease-in-out;
        }
        
        /* Focus styles for accessibility */
        .focus\\:ring-2:focus {
          outline: none;
          ring: 2px solid #C53D39;
          ring-opacity: 0.5;
        }
      `}</style>

      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <HeroCarousel />
          <MovingTextBanner />
          <MainCategories />
          <ProductsSlider />
          <FeaturesSection />
          <ProductCarousel />
          <OfficeBannerSection />
          <CircularCategories />
          <TabbedProductSection />
          <GamingChairsBanner />
          <ShopByRoom />
          <ProductShowcase />
          <OurClients />
          <ArticlesBlogs />
          <InstagramFollow />
          <ScrollAnimation />
        </main>
        <Footer />
      </div>
    </>
  )
}
