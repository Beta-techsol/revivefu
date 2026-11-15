// Product-level SEO metadata generator
// Use this to generate SEO-optimized meta tags for individual products

import { seoConfig } from "./seo-config"

export interface ProductSEOData {
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  originalPrice?: number
  image: string
  rating?: number
  reviewCount?: number
  inStock: boolean
  sku: string
}

// Generate product-specific keywords
export function getProductKeywords(product: ProductSEOData): string[] {
  const keywords: string[] = []

  // Add product name variations
  keywords.push(product.name)
  keywords.push(`${product.name} Pakistan`)
  keywords.push(`${product.name} Lahore`)
  keywords.push(`buy ${product.name}`)
  keywords.push(`${product.name} price Pakistan`)

  // Add category-specific keywords
  keywords.push(product.category)
  keywords.push(`${product.category} Pakistan`)
  keywords.push(`${product.category} Lahore`)
  keywords.push(`buy ${product.category}`)

  // Add long-tail keywords
  keywords.push(`best ${product.name}`)
  keywords.push(`affordable ${product.name}`)
  keywords.push(`${product.category} online Pakistan`)
  keywords.push(`${product.name} online shopping`)

  // Add location keywords
  keywords.push("furniture Pakistan")
  keywords.push("furniture Lahore")

  return keywords.slice(0, 20) // Limit to 20 most relevant keywords
}

// Generate product meta description
export function getProductMetaDescription(product: ProductSEOData): string {
  const rawDesc = (product.description || "").trim()
  const description = `Buy ${product.name} online in Pakistan. ${rawDesc ? `${rawDesc.substring(0, 80)}... ` : ""}Affordable price. Fast delivery to Lahore, Karachi, Islamabad.`
  return description.substring(0, 160)
}

// Generate product meta title
export function getProductMetaTitle(product: ProductSEOData): string {
  return `${product.name} Online - Rs. ${product.price} | Revive Furniture Pakistan`
}

// Generate Product Schema (JSON-LD)
export function generateProductSchema(product: ProductSEOData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Revive Furniture",
    },
    image: product.image,
    offers: {
      "@type": "Offer",
      url: `${seoConfig.baseUrl}/product/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price.toString(),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Revive Furniture Pakistan",
        url: seoConfig.baseUrl,
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.toString(),
          reviewCount: (product.reviewCount || 0).toString(),
        }
      : undefined,
  }
}

// Generate Breadcrumb Schema (JSON-LD)
export function generateBreadcrumbSchema(product: ProductSEOData) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: seoConfig.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${seoConfig.baseUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: `${seoConfig.baseUrl}/shop?category=${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${seoConfig.baseUrl}/product/${product.slug}`,
      },
    ],
  }
}
