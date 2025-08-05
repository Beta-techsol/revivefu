"use client"

import { HeroCarousel } from "@/components/hero-carousel"
import { FurnitureShowcaseSection } from "@/components/furniture-showcase-section"
import { FurnitureCategoriesGrid } from "@/components/furniture-categories-grid"
import { TabbedProductSection } from "@/components/tabbed-product-section"
import { InteractiveHotspotBanner } from "@/components/interactive-hotspot-banner"
import { PromotionalBanners } from "@/components/promotional-banners"
import { ProductCarousel } from "@/components/product-carousel"
import { RevitalizeSection } from "@/components/revitalize-section"
import { MainCategories } from "@/components/main-categories"
import { CircularCategories } from "@/components/circular-categories"
import { ShopByRoom } from "@/components/shop-by-room"
import { GamingChairsBanner } from "@/components/gaming-chairs-banner"
import { ProductShowcase } from "@/components/product-showcase"
import { ScrollNavigation } from "@/components/scroll-navigation"
import { OurClients } from "@/components/our-clients"
import { InstagramFollow } from "@/components/instagram-follow"
import { ArticlesBlogs } from "@/components/articles-blogs"
import { useEffect } from "react"

const products = [
  {
    id: "hero-1",
    name: "Luxe Sectional Sofa",
    price: 2299.99,
    originalPrice: 2899.99,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    description: "Premium leather sectional with ergonomic design and built-in USB charging ports",
    rating: 4.9,
    isOnSale: true,
    discount: 21,
  },
  {
    id: "hero-2",
    name: "Executive Office Chair",
    price: 899.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Ergonomic office chair with lumbar support and premium materials",
    rating: 4.8,
    isOnSale: true,
    discount: 25,
  },
  {
    id: "hero-3",
    name: "Modern Dining Set",
    price: 1599.99,
    originalPrice: 1999.99,
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
    description: "Contemporary 8-seater dining table with matching chairs in oak finish",
    rating: 4.7,
    isOnSale: true,
    discount: 20,
  },
  {
    id: "hero-4",
    name: "King Platform Bed",
    price: 1299.99,
    originalPrice: 1699.99,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    description: "Minimalist king size platform bed with integrated nightstands",
    rating: 4.6,
    isOnSale: true,
    discount: 24,
  },
  {
    id: "5",
    name: "Coffee Table",
    price: 599.99,
    originalPrice: 799.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    description: "Modern glass-top coffee table with storage compartment",
    rating: 4.5,
    isOnSale: true,
    discount: 25,
  },
  {
    id: "6",
    name: "Bookshelf Unit",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=400&h=400&fit=crop",
    description: "5-tier wooden bookshelf with adjustable shelves",
    rating: 4.4,
  },
  {
    id: "7",
    name: "Recliner Chair",
    price: 899.99,
    originalPrice: 1099.99,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
    description: "Leather recliner chair with massage function and cup holders",
    rating: 4.8,
    isOnSale: true,
    discount: 18,
  },
  {
    id: "8",
    name: "Wardrobe Cabinet",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=400&fit=crop",
    description: "Spacious 3-door wardrobe with mirror and multiple compartments",
    rating: 4.6,
  },
]

export default function HomePage() {
  useEffect(() => {
    // Add touch-friendly styles for mobile hover effects
    const addMobileTouchStyles = () => {
      const style = document.createElement("style")
      style.textContent = `
        @media (max-width: 768px) {
          /* Enable touch-friendly hover effects */
          .group:active .group-hover\\:scale-105 {
            transform: scale(1.05);
          }
          .group:active .group-hover\\:shadow-xl {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .group:active .group-hover\\:opacity-100 {
            opacity: 1;
          }
          .group:active .group-hover\\:-translate-y-1 {
            transform: translateY(-0.25rem);
          }
          .group:active .group-hover\\:text-white {
            color: white;
          }
          .group:active .group-hover\\:bg-gradient-to-r {
            background-image: linear-gradient(to right, var(--tw-gradient-stops));
          }
          
          /* Touch feedback for interactive elements */
          .hover\\:scale-105:active {
            transform: scale(1.05);
          }
          .hover\\:-translate-y-1:active {
            transform: translateY(-0.25rem);
          }
          .hover\\:shadow-2xl:active {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          
          /* Ensure touch targets are large enough */
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Improve touch scrolling */
          * {
            -webkit-overflow-scrolling: touch;
          }
        }
      `
      document.head.appendChild(style)
    }

    addMobileTouchStyles()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Furniture Showcase Section */}
      <FurnitureShowcaseSection />

      {/* Furniture Categories Grid */}
      <FurnitureCategoriesGrid />

      {/* Tabbed Product Section */}
      <TabbedProductSection />

      {/* Interactive Hotspot Banner */}
      <InteractiveHotspotBanner />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Product Carousel - Full Width */}
      <ProductCarousel
        products={products}
        title="Best Seller Products"
        subtitle="Discover our most popular furniture pieces that combine style, comfort, and quality craftsmanship"
      />

      {/* Revitalize Section */}
      <RevitalizeSection />

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

      {/* Our Clients */}
      <OurClients />

      {/* Instagram Follow */}
      <InstagramFollow />

      {/* Articles & Blogs */}
      <ArticlesBlogs />
    </main>
  )
}
