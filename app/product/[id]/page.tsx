"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import ProductImageGallery from "@/components/product/product-image-gallery"
import ProductDetails from "@/components/product/product-details"
import StickyCartBar from "@/components/product/sticky-cart-bar"
import ProductTabs from "@/components/product/product-tabs"
import ThreeSixtyViewerModal from "@/components/product/360-viewer-modal"
import { useCart } from "@/hooks/use-cart"

// Mock product data - in real app, this would come from API
const getProductData = (id: string) => {
  const products = {
    "modern-sectional-sofa": {
      id: "modern-sectional-sofa",
      name: "Modern Sectional Sofa",
      price: 1299,
      originalPrice: 1599,
      rating: 4.5,
      reviewCount: 127,
      colors: [
        { name: "Charcoal Gray", value: "#36454F" },
        { name: "Navy Blue", value: "#000080" },
        { name: "Cream", value: "#F5F5DC" },
      ],
      sizes: ["Small", "Medium", "Large"],
      sku: "REV-SOF-001",
      categories: ["Living Room", "Sofas", "Modern", "Best Seller"],
      inStock: true,
      description:
        "Experience ultimate comfort with our Modern Sectional Sofa. Crafted with premium materials and contemporary design, this piece combines style and functionality. The modular design allows for flexible arrangement to suit any living space. High-quality foam cushioning ensures lasting comfort, while the durable fabric withstands daily use.",
      images: [
        "/shop/products/sofa-1.jpg",
        "/shop/products/sofa-2.jpg",
        "/shop/products/chair-1.jpg",
        "/shop/products/dining-table-1.jpg",
      ],
      specifications: {
        Dimensions: '108" W x 75" D x 32" H',
        Material: "Premium Fabric, Hardwood Frame",
        "Color Options": "Charcoal Gray, Navy Blue, Cream",
        Weight: "180 lbs",
        Assembly: "Required",
        Warranty: "5 Years",
        "Care Instructions": "Professional cleaning recommended",
      },
      reviews: [
        {
          id: "1",
          name: "Sarah Johnson",
          rating: 5,
          comment:
            "Absolutely love this sofa! The quality is exceptional and it's incredibly comfortable. Perfect for our living room.",
          date: "December 15, 2024",
        },
        {
          id: "2",
          name: "Mike Chen",
          rating: 4,
          comment: "Great value for money. Assembly was straightforward and the sofa looks exactly as pictured.",
          date: "December 10, 2024",
        },
      ],
    },
  }

  return products[id as keyof typeof products] || products["modern-sectional-sofa"]
}

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [show360View, setShow360View] = useState(false)

  const product = getProductData(params.id as string)

  const handleAddToCart = (quantity: number, color: string, size: string) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      color,
      size,
    })
  }

  const handleBuyNow = (quantity: number, color: string, size: string) => {
    handleAddToCart(quantity, color, size)
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  const handleCompare = () => {
    // Add to comparison list
    console.log("Added to comparison")
  }

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: "Living Room", href: "/shop?category=living-room" },
    { label: product.name },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
            isWishlisted={isWishlisted}
            on360ViewClick={() => setShow360View(true)}
          />

          {/* Product Details */}
          <ProductDetails
            product={product}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onCompare={handleCompare}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Related products would go here */}
          </div>
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <StickyCartBar
        product={{
          name: product.name,
          price: product.price,
          image: product.images[0],
        }}
        onAddToCart={(quantity) => handleAddToCart(quantity, product.colors[0]?.name || "", product.sizes[0] || "")}
      />

      {/* 360° Viewer Modal */}
      <ThreeSixtyViewerModal
        isOpen={show360View}
        onClose={() => setShow360View(false)}
        images={product.images}
        productName={product.name}
      />
    </div>
  )
}
