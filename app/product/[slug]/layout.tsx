import type React from "react"
import type { Metadata } from "next"
import { sql } from "@/lib/db"
import { generateProductMetadata } from "@/lib/metadata-utils"

export const revalidate = 300

// Fetch product data directly from DB for metadata (cached with ISR)
async function getProduct(slug: string) {
  try {
    const result = await sql`
      SELECT
        p.id,
        p.slug,
        p.name,
        p.description,
        p.short_description,
        p.price::numeric as price,
        p.images,
        COALESCE(
          c.name,
          (
            SELECT cat.name
            FROM product_categories pc
            JOIN categories cat ON pc.category_id = cat.id
            WHERE pc.product_id = p.id
            LIMIT 1
          )
        ) as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug} AND p.status = 'active'
      LIMIT 1
    `

    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching product for metadata:", error)
    return null
  }
}

// Extract and validate first image from product images
function getFirstImage(images: string | string[] | null | undefined): string {
  const sanitize = (val: unknown): string | null => {
    if (typeof val !== "string") return null
    const trimmed = val.trim()
    if (!trimmed) return null
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed
    }
    return "/" + trimmed.replace(/^\.+\/+/, "")
  }

  try {
    if (Array.isArray(images)) {
      for (const item of images) {
        const clean = sanitize(item)
        if (clean) return clean
      }
      return "/google.jpg"
    }
    if (typeof images === "string") {
      const trimmed = images.trim()
      if (!trimmed) return "/google.jpg"
      if (trimmed.startsWith("[")) {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const clean = sanitize(item)
            if (clean) return clean
          }
        }
      }
      return sanitize(trimmed) || "/google.jpg"
    }
    return "/google.jpg"
  } catch {
    return sanitize(images) || "/google.jpg"
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)

  if (!product) {
    return {
      title: "Product Not Found | Revive Furniture Pakistan",
      description: "The product you are looking for does not exist.",
    }
  }

  return generateProductMetadata({
    name: product.name || "Furniture Product",
    slug: product.slug || params.slug,
    description: product.description || product.short_description || "",
    price: Number.parseFloat(product.price) || 0,
    image: getFirstImage(product.images),
    category: product.category_name || "Furniture",
  })
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
