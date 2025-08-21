import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/product/product-details"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  compare_price: number
  images: any[]
  category_name: string
  material: string
  color: string
  brand: string
  stock_quantity: number
  average_rating: number
  review_count: number
  is_featured: boolean
  is_trending: boolean
  is_best_seller: boolean
  room_type_name: string
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const result = await sql`
      SELECT 
        p.id,
        p.name,
        p.slug,
        p.description,
        p.short_description,
        p.price,
        p.compare_price,
        p.images,
        p.material,
        p.color,
        p.brand,
        p.stock_quantity,
        p.average_rating,
        p.review_count,
        p.is_featured,
        p.is_trending,
        p.is_best_seller,
        c.name as category_name,
        rt.name as room_type_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN room_type rt ON p.room_type_id = rt.id
      WHERE p.slug = ${slug}
      AND p.status = 'active'
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as Product
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <ProductDetails product={product} />
        <ProductTabs product={product} />
        <RelatedProducts currentProductId={product.id} categoryId={product.category_name} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | Premium Furniture`,
    description: product.short_description || product.description,
    openGraph: {
      title: product.name,
      description: product.short_description || product.description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  }
}
