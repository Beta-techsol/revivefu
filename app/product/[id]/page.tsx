"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { BreadcrumbComponent } from "@/components/ui/breadcrumb"
import ProductImageGallery from "@/components/product/product-image-gallery"
import ProductDetails from "@/components/product/product-details"
import StickyCartBar from "@/components/product/sticky-cart-bar"
import ProductTabs from "@/components/product/product-tabs"
import ThreeSixtyViewerModal from "@/components/product/360-viewer-modal"
import { ProductCarousel } from "@/components/product-carousel"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  description: string
  short_description: string
  sku: string
  status: string
  stock_quantity: number
  images: string | string[]
  tags: string | string[]
  material: string
  color: string
  brand: string
  average_rating: number
  review_count: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  is_hot_selling: boolean
  is_deal_of_day: boolean
  is_latest: boolean
  room_type: string
  category_name: string
  category_slug: string
  category_id: string
}

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [show360View, setShow360View] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.product)
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch("/api/products?limit=10")
      const data = await response.json()

      if (data.success && data.products) {
        // Filter related products by same category or similar tags
        const related = data.products
          .filter(
            (p: Product) =>
              p.id !== product?.id &&
              (p.category_name === product?.category_name || p.room_type === product?.room_type),
          )
          .slice(0, 8)

        setRelatedProducts(related)
      }
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  const getProductImages = (images: string | string[]) => {
    if (!images) return []
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed.filter((img) => img && img.trim()) : [images]
      } catch {
        return images.trim() ? [images] : []
      }
    }
    return Array.isArray(images) ? images.filter((img) => img && img.trim()) : []
  }

  const getProductTags = (tags: string | string[]) => {
    if (!tags) return []
    if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags)
        return Array.isArray(parsed) ? parsed.filter((tag) => tag && tag.trim()) : [tags]
      } catch {
        return tags.trim() ? [tags] : []
      }
    }
    return Array.isArray(tags) ? tags.filter((tag) => tag && tag.trim()) : []
  }

  const handleAddToCart = (quantity: number, color: string, size: string) => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImages(product.images)[0] || "/placeholder.svg",
      quantity,
      color,
      size,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const handleBuyNow = (quantity: number, color: string, size: string) => {
    handleAddToCart(quantity, color, size)
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  const handleCompare = () => {
    // Add to comparison list
    toast({
      title: "Added to Compare",
      description: "Product has been added to comparison list",
    })
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#C53D39] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <a href="/shop" className="bg-[#C53D39] text-white px-6 py-3 rounded-lg hover:bg-[#B12E2A]">
            Back to Shop
          </a>
        </div>
      </div>
    )
  }

  const productImages = getProductImages(product.images)
  const productTags = getProductTags(product.tags)

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: product.category_name, href: `/shop?category=${product.category_name}` },
    { label: product.name },
  ]

  // Transform product for component compatibility
  const transformedProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.compare_price,
    rating: product.average_rating,
    reviewCount: product.review_count,
    colors: [{ name: product.color || "Default", value: "#36454F" }],
    sizes: ["Small", "Medium", "Large"],
    sku: product.sku,
    categories: [product.category_name, product.room_type].filter(Boolean),
    inStock: product.stock_quantity > 0,
    description: product.description,
    images: productImages.length > 0 ? productImages : ["/placeholder.svg?height=400&width=400"],
    specifications: {
      Dimensions: "Standard Size",
      Material: product.material || "Premium Quality",
      Color: product.color || "As Shown",
      Brand: product.brand || "Revive Furniture",
      SKU: product.sku,
      Stock: product.stock_quantity.toString(),
      "Room Type": product.room_type || "General",
      "Care Instructions": "Professional cleaning recommended",
    },
    reviews: [
      {
        id: "1",
        name: "Customer Review",
        rating: product.average_rating,
        comment: "Great product with excellent quality and design.",
        date: new Date().toLocaleDateString(),
      },
    ],
  }

  // Transform related products for carousel
  const transformedRelatedProducts = relatedProducts.map((relatedProduct) => {
    const relatedImages = getProductImages(relatedProduct.images)
    return {
      id: relatedProduct.id,
      name: relatedProduct.name,
      price: relatedProduct.price,
      originalPrice: relatedProduct.compare_price,
      image: relatedImages.length > 0 ? relatedImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage:
        relatedImages.length > 1
          ? relatedImages[1]
          : relatedImages.length > 0
            ? relatedImages[0]
            : "/placeholder.svg?height=400&width=400",
      description: relatedProduct.short_description || relatedProduct.description || "",
      rating: relatedProduct.average_rating || 0,
      isOnSale: !!relatedProduct.compare_price && relatedProduct.compare_price > relatedProduct.price,
      isSoldOut: relatedProduct.stock_quantity === 0,
      discount: relatedProduct.compare_price
        ? Math.round(((relatedProduct.compare_price - relatedProduct.price) / relatedProduct.compare_price) * 100)
        : 0,
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <BreadcrumbComponent items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <ProductImageGallery
            images={transformedProduct.images}
            productName={transformedProduct.name}
            onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
            isWishlisted={isWishlisted}
            on360ViewClick={() => setShow360View(true)}
          />

          {/* Product Details */}
          <ProductDetails
            product={transformedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onCompare={handleCompare}
          />
        </div>

        {/* Product Tabs */}
        <ProductTabs product={transformedProduct} />

        {/* Related Products Carousel */}
        {transformedRelatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductCarousel
              products={transformedRelatedProducts}
              title="Related Products"
              subtitle="Discover similar products you might like"
            />
          </div>
        )}
      </div>

      {/* Sticky Cart Bar */}
      <StickyCartBar
        product={{
          name: transformedProduct.name,
          price: transformedProduct.price,
          image: transformedProduct.images[0],
        }}
        onAddToCart={(quantity) =>
          handleAddToCart(quantity, transformedProduct.colors[0]?.name || "", transformedProduct.sizes[0] || "")
        }
      />

      {/* 360° Viewer Modal */}
      <ThreeSixtyViewerModal
        isOpen={show360View}
        onClose={() => setShow360View(false)}
        images={transformedProduct.images}
        productName={transformedProduct.name}
      />
    </div>
  )
}
