import type React from "react"
import type { Metadata } from "next"
import { generateProductMetadata } from "@/lib/metadata-utils"

// Fetch product data for metadata
async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revivefurniture.pk"
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.success ? data.product : null
  } catch (error) {
    console.error("Error fetching product for metadata:", error)
    return null
  }
}

// Extract image from product images
function getFirstImage(images: string | string[]): string {
  try {
    if (typeof images === "string") {
      const parsed = JSON.parse(images)
      const imgArray = Array.isArray(parsed) ? parsed : [images]
      return imgArray[0] || "/placeholder.svg"
    }
    const imgArray = Array.isArray(images) ? images : [images]
    return imgArray[0] || "/placeholder.svg"
  } catch {
    return typeof images === "string" ? images : "/placeholder.svg"
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
    name: product.name,
    slug: product.slug,
    description: product.description || product.short_description,
    price: product.price,
    image: getFirstImage(product.images),
    category: product.category_name,
  })
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
