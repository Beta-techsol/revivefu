"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Star, Heart, Share2, ShoppingCart, Plus, Minus, Truck, Shield, RotateCcw } from "lucide-react"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import { ProductTabs } from "@/components/product/product-tabs"
import { StickyCartBar } from "@/components/product/sticky-cart-bar"
import { ProductCarousel } from "@/components/product-carousel"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface Product {
  id: number
  name: string
  price: number
  compare_price?: number
  description: string
  short_description?: string
  sku: string
  images: string[]
  category_name: string
  category_slug: string
  room_type?: string
  room_type_slug?: string
  average_rating: number
  review_count: number
  stock_quantity: number
  material?: string
  color?: string
  brand?: string
  tags: string[]
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching product with ID:", productId)

      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      console.log("Product page - API response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch product")
      }

      if (data.success && data.product) {
        setProduct(data.product)
      } else {
        throw new Error(data.error || "Product not found")
      }
    } catch (err) {
      console.error("Error fetching product:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "/placeholder.svg",
        quantity: quantity,
      })
    }
  }

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] || "/placeholder.svg",
        })
      }
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || "Product Not Found"}</h2>
          <p className="text-gray-600 mb-4">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </Card>
      </div>
    )
  }

  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-gray-900">
            Home
          </a>
          <span>/</span>
          <a href="/shop" className="hover:text-gray-900">
            Shop
          </a>
          <span>/</span>
          {product.category_name && (
            <>
              <a href={`/shop?category=${product.category_slug}`} className="hover:text-gray-900">
                {product.category_name}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_featured && <Badge variant="secondary">Featured</Badge>}
              {product.is_trending && <Badge variant="secondary">Trending</Badge>}
              {product.is_best_seller && <Badge variant="secondary">Best Seller</Badge>}
              {discountPercentage > 0 && <Badge variant="destructive">{discountPercentage}% OFF</Badge>}
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.average_rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.average_rating} ({product.review_count} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-xl text-gray-500 line-through">${product.compare_price.toFixed(2)}</span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && <p className="text-gray-600 leading-relaxed">{product.short_description}</p>}

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.category_name && (
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category_name}</span>
                </div>
              )}
              {product.room_type && (
                <div>
                  <span className="font-medium text-gray-900">Room Type:</span>
                  <span className="ml-2 text-gray-600">{product.room_type}</span>
                </div>
              )}
              {product.material && (
                <div>
                  <span className="font-medium text-gray-900">Material:</span>
                  <span className="ml-2 text-gray-600">{product.material}</span>
                </div>
              )}
              {product.color && (
                <div>
                  <span className="font-medium text-gray-900">Color:</span>
                  <span className="ml-2 text-gray-600">{product.color}</span>
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="font-medium text-gray-900">Brand:</span>
                  <span className="ml-2 text-gray-600">{product.brand}</span>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-900">Stock:</span>
                <span className={`ml-2 ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                </span>
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock_quantity}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleAddToCart} disabled={product.stock_quantity === 0} className="flex-1" size="lg">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleWishlistToggle} size="lg" className="px-4 bg-transparent">
                  <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" className="px-4 bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Warranty</p>
                  <p className="text-xs text-gray-600">2 year warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-600">30 day returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <ProductCarousel />
        </div>
      </div>

      {/* Sticky Cart Bar */}
      <StickyCartBar
        product={product}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
