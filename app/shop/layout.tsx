import type React from "react"
import type { Metadata } from "next"
import { generatePageMetadata } from "@/lib/metadata-utils"

export const metadata: Metadata = generatePageMetadata("shop", {
  title: "Shop Premium Furniture Online | Revive Furniture Pakistan",
  description:
    "Browse our extensive collection of premium wooden furniture, home decor, office furniture in Lahore, Karachi, Islamabad. Best prices with free delivery across Pakistan.",
  keywords: [
    "buy furniture online",
    "furniture shop Pakistan",
    "wooden furniture",
    "home decor",
    "office furniture",
    "furniture Lahore",
    "furniture Karachi",
    "furniture Islamabad",
  ],
})

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
