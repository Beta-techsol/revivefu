"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Share2, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

const heroProducts = [
  {
    id: 325,
    name: "Luxury Bedroom Set",
    shortDescription: "Elegant baroque-style bedroom furniture with golden accents",
    fullDescription:
      "Transform your bedroom into a royal suite with this exquisite baroque-style bedroom set featuring ornate golden details and premium craftsmanship.",
    price: 450000,
    originalPrice: 550000,
    image: "/hero-products/luxury-bedroom-set.webp",
    link: "https://v0-create-e-commerce-store.vercel.app/product/325",
    features: [
      "Premium solid wood construction",
      "Hand-carved golden details",
      "Tufted leather headboard",
      "Matching dresser included",
    ],
    category: "Bedroom",
    inStock: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 271,
    name: "Modern Dining Chair",
    shortDescription: "Contemporary leather chair with quilted design",
    fullDescription:
      "Elevate your dining experience with this sophisticated modern chair featuring premium leather upholstery and sleek metal legs.",
    price: 25000,
    originalPrice: 32000,
    image: "/hero-products/modern-dining-chair.webp",
    link: "https://v0-create-e-commerce-store.vercel.app/product/271",
    features: ["Genuine leather upholstery", "Quilted comfort design", "Sturdy metal legs", "Ergonomic seating"],
    category: "Dining",
    inStock: true,
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 331,
    name: "Executive Office Desk",
    shortDescription: "Modern workspace solution with premium materials",
    fullDescription:
      "Create the perfect workspace with this contemporary office desk featuring a beautiful wood top and minimalist white metal frame.",
    price: 85000,
    originalPrice: 105000,
    image: "/hero-products/office-desk.webp",
    link: "https://v0-create-e-commerce-store.vercel.app/product/331",
    features: ["Solid wood desktop", "Powder-coated metal frame", "Cable management system", "Spacious work surface"],
    category: "Office",
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
]

export function ModernHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()

  const currentProduct = heroProducts[currentSlide]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProducts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProducts.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProducts.length) % heroProducts.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const handleShare = async () => {
    const shareData = {
      title: currentProduct.name,
      text: currentProduct.shortDescription,
      url: currentProduct.link,
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Product shared successfully!")
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(currentProduct.link)
        toast.success("Product link copied to clipboard!")
      }
    } catch (error) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentProduct.link)
        toast.success("Product link copied to clipboard!")
      } catch (clipboardError) {
        toast.error("Unable to share product")
      }
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: currentProduct.id.toString(),
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
      quantity: 1,
    })
    toast.success("Added to cart!")
  }

  const handleAddToWishlist = () => {
    addToWishlist({
      id: currentProduct.id.toString(),
      name: currentProduct.name,
      price: currentProduct.price,
      image: currentProduct.image,
    })
    toast.success("Added to wishlist!")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage = Math.round(
    ((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100,
  )
  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900/20" />

      <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] lg:min-h-[600px]">
          {/* Left Side - Hero Content */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                {currentProduct.category} Collection
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                <span className="block text-lg md:text-xl lg:text-2xl font-normal text-gray-600 mb-2">Discover</span>
                {currentProduct.name}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                {currentProduct.fullDescription}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full border-2 hover:bg-orange-50 hover:border-orange-200 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex space-x-2">
                  {heroProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "bg-orange-500 w-8" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full border-2 hover:bg-orange-50 hover:border-orange-200 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                {String(currentSlide + 1).padStart(2, "0")} / {String(heroProducts.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Right Side - Product Card */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
              <CardContent className="p-0">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={currentProduct.image || "/placeholder.svg"}
                    alt={currentProduct.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleAddToWishlist}
                      className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                    >
                      <Heart
                        className={`h-4 w-4 ${isInWishlist(currentProduct.id.toString()) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleShare}
                      className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Link href={currentProduct.link}>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-white/90 hover:bg-white shadow-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{currentProduct.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{currentProduct.shortDescription}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(currentProduct.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {currentProduct.rating} ({currentProduct.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(currentProduct.price)}</span>
                      {currentProduct.originalPrice > currentProduct.price && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(currentProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-green-600 font-medium">✓ In Stock - Ready to Ship</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Link href={currentProduct.link} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-3 rounded-lg transition-colors duration-200 bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-200 rounded-full -translate-x-16 translate-y-16 opacity-20"></div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200 rounded-full translate-x-24 -translate-y-24 opacity-20"></div>
    </section>
  )
}
