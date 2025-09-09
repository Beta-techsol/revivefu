"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Head from "next/head"
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
    if (params.slug) {
      fetchProduct(params.slug as string)
    }
  }, [params.slug])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts()
    }
  }, [product])

  const fetchProduct = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`)
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

  const getProductImages = (images: string | string[]) => {
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images)
        return Array.isArray(parsed) ? parsed : [images]
      } catch {
        return [images]
      }
    }
    return Array.isArray(images) ? images : []
  }

  const getProductTags = (tags: string | string[]) => {
    if (typeof tags === "string") {
      try {
        const parsed = JSON.parse(tags)
        return Array.isArray(parsed) ? parsed : [tags]
      } catch {
        return [tags]
      }
    }
    return Array.isArray(tags) ? tags : []
  }

  const handleAddToCart = (quantity: number, color: string, size: string) => {
    if (!product) return

    addToCart({
      id: product.slug, // ✅ use slug in cart
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
    window.location.href = "/checkout"
  }

  const handleCompare = () => {
    if (!product) return

    const compareItem = {
      id: product.slug, // ✅ use slug
      name: product.name,
      price: product.price,
      originalPrice: product.compare_price,
      image: getProductImages(product.images)[0] || "/placeholder.svg",
      category: product.category_name,
      material: product.material || "Premium Quality",
      color: product.color || "As Shown",
      brand: product.brand || "Revive Furniture",
      rating: product.average_rating,
      reviews: product.review_count,
      inStock: product.stock_quantity > 0,
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
      id: product.slug, // ✅ use slug
      name: product.name,
      price: product.price,
      image: getProductImages(product.images)[0] || "/placeholder.svg",
      description: product.short_description || product.description,
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
  const productTags = getProductTags(product.tags)

 const breadcrumbItems = [
  { label: "Shop", href: "/shop" },
  { label: product.category_name, href: `/shop?category=${product.category_slug}` }, // ✅ use slug
  { label: product.name },
]


  // ✅ Product schema (with slug)
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: getProductImages(product.images),
    description: product.description || product.short_description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand || "Revive Furniture",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.average_rating?.toString(),
        reviewCount: product.review_count?.toString(),
      },
    }),
  }

  // ✅ Breadcrumb schema with slug
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"}/product/${product.slug}`,
      },
    ],
  }

  const combinedSchema = [productSchema, breadcrumbSchema]


  const transformedProduct = {
    id: product.id,
    slug: product.slug,
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
    images: productImages.length > 0 ? productImages : [],
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

  const transformedRelatedProducts = relatedProducts.map((relatedProduct) => {
    const relatedImages = getProductImages(relatedProduct.images)
    return {
      id: relatedProduct.id,
      name: relatedProduct.name,
      price: relatedProduct.price,
      originalPrice: relatedProduct.compare_price,
      image: relatedImages.length > 0 ? relatedImages[0] : "/placeholder.svg?height=400&width=400",
      hoverImage: relatedImages.length > 1 ? relatedImages[1] : relatedImages[0],
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
    <>
     <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(combinedSchema),
          }}
        />
      </Head>
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
            image: transformedProduct.images[0],
          }}
          onAddToCart={(quantity) =>
            handleAddToCart(quantity, transformedProduct.colors[0]?.name || "", transformedProduct.sizes[0] || "")
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
