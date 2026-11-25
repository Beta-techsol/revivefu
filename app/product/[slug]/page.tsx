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
import { useWishlist } from "@/hooks/use-wishlist"
import { useCompare } from "@/hooks/use-compare"

// --- Types ---
interface Product {
  id: string
  slug: string
  name: string
  price: number
  compare_price?: number
  description: string
  short_description: string
  sku: string
  status: string
  stock_quantity: number
  continue_selling?: boolean
  track_quantity?: boolean
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
  room_type_slug: string
  category_name: string
  category_slug: string
  category_id: string
  rating?: number
  reviews?: number
}

function sanitizeImageUrl(url: unknown): string | null {
  if (typeof url !== "string") return null
  const trimmed = url.trim()
  if (!trimmed) return null
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed
  }
  return "/" + trimmed.replace(/^\.+\/+/, "")
}

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [show360View, setShow360View] = useState(false)

  useEffect(() => {
    if (params?.slug) {
      fetchProduct(params.slug as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.slug])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.slug])

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`)
      const data = await response.json()

      if (data.success && data.product) {
        setProduct(data.product)
      } else {
        setProduct(null)
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setProduct(null)
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
        const related = data.products
          .filter(
            (p: Product) =>
              p.slug !== product?.slug &&
              (p.category_name === product?.category_name || p.room_type === product?.room_type),
          )
          .slice(0, 8)

        setRelatedProducts(related)
      }
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  const getProductImages = (images: string | string[] | null | undefined): string[] => {
    let rawList: unknown[] = []
    if (Array.isArray(images)) {
      rawList = images
    } else if (typeof images === "string") {
      const trimmed = images.trim()
      if (trimmed) {
        try {
          const parsed = JSON.parse(trimmed)
          rawList = Array.isArray(parsed) ? parsed : [trimmed]
        } catch {
          rawList = [trimmed]
        }
      }
    }
    return rawList.map(sanitizeImageUrl).filter((item): item is string => Boolean(item))
  }

  const getProductTags = (tags: string | string[] | null | undefined): string[] => {
    if (Array.isArray(tags)) return tags.map(String).filter(Boolean)
    if (typeof tags === "string") {
      const trimmed = tags.trim()
      if (!trimmed) return []
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [trimmed]
      } catch {
        return [trimmed]
      }
    }
    return []
  }

  const handleAddToCart = (quantity: number, color: string, size: string) => {
    if (!product) return

    addToCart({
      id: product.slug,
      name: product.name,
      sku: product.sku || "",
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
    window.location.href = "/checkout"
  }

  const handleCompare = () => {
    if (!product) return

    const stockQty = Number.isFinite(Number(product.stock_quantity)) ? Number(product.stock_quantity) : 0

    const compareItem = {
      id: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: getProductImages(product.images)[0] || "/placeholder.svg",
      category: product.category_name || "Furniture",
      material: product.material || "Premium Quality",
      color: product.color || "As Shown",
      brand: product.brand || "Revive Furniture",
      rating: product.average_rating || 0,
      reviews: product.review_count || 0,
      inStock: stockQty > 0,
    }

    if (isInCompare(product.slug)) {
      toast({
        title: "Already in Compare",
        description: "This product is already in your comparison list",
        variant: "destructive",
      })
    } else {
      addToCompare(compareItem)
      toast({
        title: "Added to Compare",
        description: `${product.name} has been added to comparison list`,
      })
    }
  }

  const handleWishlistToggle = () => {
    if (!product) return

    const wishlistItem = {
      id: product.slug,
      name: product.name,
      price: product.price,
      image: getProductImages(product.images)[0] || "/placeholder.svg",
      description: product.short_description || product.description || "",
    }

    if (isInWishlist(product.slug)) {
      removeFromWishlist(product.slug)
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      addToWishlist(wishlistItem)
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
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
  const safeImages = productImages.length > 0 ? productImages : ["/placeholder.svg"]
  const _productTags = getProductTags(product.tags)
  const stockQuantity = Number.isFinite(Number(product.stock_quantity))
    ? Math.max(0, Number(product.stock_quantity))
    : 0
  const averageRating = Number.isFinite(Number(product.average_rating)) ? Number(product.average_rating) : 0
  const reviewCount = Number.isFinite(Number(product.review_count)) ? Number(product.review_count) : 0

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    ...(product.category_name && product.category_slug
      ? [{ label: product.category_name, href: `/shop?category=${product.category_slug}` }]
      : []),
    { label: product.name },
  ]

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"

  const productSchema: any = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: safeImages,
    description: product.description || product.short_description || product.name,
    
    brand: {
      "@type": "Brand",
      name: product.brand || "Revive Furniture",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price ?? 0,
      availability: (stockQuantity > 0 || Boolean(product.continue_selling))
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PK",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnShippingFees",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "5000",
          currency: "PKR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 10,
            maxValue: 15,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "d",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
      },
    },
  }

  if (reviewCount > 0) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: averageRating.toString(),
      reviewCount: reviewCount.toString(),
    }
  }

  const transformedReviews = [
    {
      id: "1",
      name: "Kafeel Shah",
      rating: averageRating || 5,
      comment: "Great product with excellent quality and design.",
      date: new Date().toLocaleDateString(),
    },
    {
      id: "2",
      name: "Ayesha Khan",
      rating: 5,
      comment: "This sofa is super comfortable and the fabric feels premium. Perfect addition to my living room!",
      date: "09/05/2025",
    },
    {
      id: "3",
      name: "Ali Raza",
      rating: 4,
      comment: "The dining table looks elegant and sturdy, though the assembly took some extra time.",
      date: "09/03/2025",
    },
    {
      id: "4",
      name: "Sana Ahmed",
      rating: 5,
      comment: "Absolutely love this bed frame! Solid wood, sleek design, and no creaking sounds.",
      date: "09/01/2025",
    },
    {
      id: "5",
      name: "Hamza Malik",
      rating: 4,
      comment: "Chair quality is nice and durable, but the delivery was also spot on.",
      date: "08/29/2025",
    },
  ]

  if (transformedReviews.length > 0) {
    productSchema.review = transformedReviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: (review.rating ?? 0).toString(),
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: review.comment,
      datePublished: review.date,
    }))
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${baseUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${baseUrl}/product/${product.slug}`,
      },
    ],
  }

  const combinedSchema = [productSchema, breadcrumbSchema]

  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price ?? 0,
    originalPrice: product.compare_price,
    rating: averageRating,
    average_rating: averageRating,
    reviews: reviewCount,
    review_count: reviewCount,
    colors: [{ name: product.color || "Default", value: "#36454F" }],
    sizes: [] as string[],
    sku: product.sku || "N/A",
    categories: [product.category_name, product.room_type].filter(Boolean),
    inStock: stockQuantity > 0 || Boolean(product.continue_selling),
    description: product.description || product.short_description || "",
    images: safeImages,
    specifications: {
      Dimensions: "Standard Size",
      Material: product.material || "Premium Quality",
      Color: product.color || "As Shown",
      Brand: product.brand || "Revive Furniture",
      SKU: product.sku || "N/A",
      Stock: stockQuantity.toString(),
      "Room Type": product.room_type || "General",
      "Care Instructions": "Professional cleaning recommended",
    },
    reviews: transformedReviews,
  }

  const transformedRelatedProducts = relatedProducts.map((relatedProduct) => {
    const relatedImages = getProductImages(relatedProduct.images)
    const relStock = Number.isFinite(Number(relatedProduct.stock_quantity))
      ? Number(relatedProduct.stock_quantity)
      : 0
    return {
      id: relatedProduct.id,
      slug: relatedProduct.slug,
      name: relatedProduct.name,
      price: relatedProduct.price,
      originalPrice: relatedProduct.compare_price,
      image: relatedImages.length > 0 ? relatedImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage: relatedImages.length > 1 ? relatedImages[1] : relatedImages[0] || "/placeholder.svg",
      description: relatedProduct.short_description || relatedProduct.description || "",
      rating: relatedProduct.average_rating || 0,
      isOnSale: !!relatedProduct.compare_price && relatedProduct.compare_price > relatedProduct.price,
      isSoldOut: relStock === 0 && !Boolean(relatedProduct.continue_selling),
      discount: relatedProduct.compare_price
        ? Math.round(((relatedProduct.compare_price - relatedProduct.price) / relatedProduct.compare_price) * 100)
        : 0,
    }
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema),
        }}
      />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <BreadcrumbComponent items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <ProductImageGallery
              images={transformedProduct.images}
              productName={transformedProduct.name}
              onWishlistToggle={handleWishlistToggle}
              isWishlisted={isInWishlist(product.slug)}
              on360ViewClick={() => setShow360View(true)}
            />

            <ProductDetails
              product={transformedProduct}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onCompare={handleCompare}
            />
          </div>

          <ProductTabs product={transformedProduct} />

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

        <StickyCartBar
          product={{
            name: transformedProduct.name,
            price: transformedProduct.price,
            image: transformedProduct.images[0] || "/placeholder.svg",
          }}
          onAddToCart={(quantity) =>
            handleAddToCart(quantity, transformedProduct.colors[0]?.name || "", "")
          }
        />

        <ThreeSixtyViewerModal
          isOpen={show360View}
          onClose={() => setShow360View(false)}
          images={transformedProduct.images}
          productName={transformedProduct.name}
        />
      </div>
    </>
  )
}
