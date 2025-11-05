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

// Generate product page metadata
export function generateProductMetadata(product: {
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: string
}): Metadata {
  const title = `${product.name} Online - Rs. ${product.price} | Revive Furniture Pakistan`
  const description = `Buy ${product.name} online at Revive Furniture Pakistan. ${product.description.substring(0, 80)}... Fast delivery to Lahore, Karachi, Islamabad.`
  const keywords = [
    product.name,
    `${product.name} Pakistan`,
    `buy ${product.name}`,
    product.category,
    `${product.category} Pakistan`,
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
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_PK",
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: generateMetaDescription(description),
      images: [product.image],
    },
  }
}
