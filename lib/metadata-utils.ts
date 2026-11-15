import type { Metadata } from "next"
import { seoConfig, generateMetaDescription, generateKeywordString } from "./seo-config"

export function generatePageMetadata(
  page: "home" | "shop" | "about" | "contact" | string,
  customMeta?: {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
  },
): Metadata {
  const pageConfig = (seoConfig.pages as Record<string, any>)[page] || {
    title: "Revive Furniture Pakistan",
    description: "Premium furniture store in Pakistan",
    keywords: ["furniture", "Pakistan"],
  }

  const title = customMeta?.title || pageConfig.title
  const description = customMeta?.description || pageConfig.description
  const keywords = customMeta?.keywords || pageConfig.keywords
  const image = customMeta?.image || "/google.jpg"

  return {
    title,
    description: generateMetaDescription(description),
    keywords: generateKeywordString(keywords),
    metadataBase: new URL(seoConfig.baseUrl),
    alternates: {
      canonical: seoConfig.baseUrl,
    },
    openGraph: {
      title,
      description: generateMetaDescription(description),
      url: seoConfig.baseUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: generateMetaDescription(description),
      images: [image],
      creator: "@ReviveFurniturePK",
    },
  }
}

// Generate category page metadata
export function generateCategoryMetadata(categoryName: string, categorySlug: string): Metadata {
  const title = `${categoryName} Furniture Online Pakistan | Revive Furniture`
  const description = `Browse our collection of ${categoryName} furniture in Pakistan. Quality wooden ${categoryName}, affordable prices, free delivery to Lahore, Karachi, Islamabad.`
  const keywords = [
    categoryName,
    `${categoryName} furniture`,
    `${categoryName} Pakistan`,
    `${categoryName} Lahore`,
    `buy ${categoryName}`,
    "furniture online",
    "furniture Pakistan",
  ]

  return {
    title,
    description: generateMetaDescription(description),
    keywords: generateKeywordString(keywords),
    metadataBase: new URL(seoConfig.baseUrl),
    alternates: {
      canonical: `${seoConfig.baseUrl}/shop?category=${categorySlug}`,
    },
    openGraph: {
      title,
      description: generateMetaDescription(description),
      url: `${seoConfig.baseUrl}/shop?category=${categorySlug}`,
      siteName: seoConfig.siteName,
      locale: "en_PK",
      type: "website",
    },
  }
}

// Normalize image URL for OpenGraph/Twitter metadata
function normalizeMetaImageUrl(image?: string | null): string {
  if (!image || typeof image !== "string") return "/google.jpg"
  const trimmed = image.trim()
  if (!trimmed) return "/google.jpg"
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed
  }
  return "/" + trimmed.replace(/^\.+\/+/, "")
}

// Generate product page metadata
export function generateProductMetadata(product: {
  name?: string | null
  slug: string
  description?: string | null
  price?: number | null
  image?: string | null
  category?: string | null
}): Metadata {
  const safeName = (product.name || "Furniture Product").trim()
  const safePrice = Number.isFinite(Number(product.price)) ? Number(product.price) : 0
  const rawDescription = (product.description || "").trim()
  const shortSnippet = rawDescription
    ? rawDescription.substring(0, 80) + (rawDescription.length > 80 ? "..." : "")
    : "Crafted for lasting comfort and style"
  const safeCategory = (product.category || "Furniture").trim()
  const safeImage = normalizeMetaImageUrl(product.image)

  const title = `${safeName} Online - Rs. ${safePrice} | Revive Furniture Pakistan`
  const description = `Buy ${safeName} online at Revive Furniture Pakistan. ${shortSnippet} Fast delivery to Lahore, Karachi, Islamabad.`
  const keywords = [
    safeName,
    `${safeName} Pakistan`,
    `buy ${safeName}`,
    safeCategory,
    `${safeCategory} Pakistan`,
    "furniture Pakistan",
  ]

  return {
    title,
    description: generateMetaDescription(description),
    keywords: generateKeywordString(keywords),
    metadataBase: new URL(seoConfig.baseUrl),
    alternates: {
      canonical: `${seoConfig.baseUrl}/product/${product.slug}`,
    },
    openGraph: {
      title,
      description: generateMetaDescription(description),
      url: `${seoConfig.baseUrl}/product/${product.slug}`,
      siteName: seoConfig.siteName,
      images: [
        {
          url: safeImage,
          width: 1200,
          height: 630,
          alt: safeName,
        },
      ],
      locale: "en_PK",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: generateMetaDescription(description),
      images: [safeImage],
    },
  }
}
