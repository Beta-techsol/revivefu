import type { Metadata } from "next"
import ShopPageWrapper from "@/components/shop-page-wrapper"

export const metadata: Metadata = {
  title: "Chairs & Stools in Pakistan | Dining, Office & Bar Chairs | Revive Furniture",
  description:
    "Premium chairs and stools in Pakistan. Dining chairs, office chairs, bar stools, and accent chairs. Comfortable seating solutions at Revive Furniture.",
  keywords: "chairs Pakistan, dining chairs, office chairs, bar stools, accent chairs, seating furniture Lahore",
  openGraph: {
    title: "Chairs & Stools in Pakistan | Dining, Office & Bar Chairs | Revive Furniture",
    description: "Premium chairs and stools in Pakistan. Dining chairs, office chairs, bar stools, and accent chairs.",
    url: "https://revivefurniture.pk/chairs-stools",
    siteName: "Revive Furniture",
    images: [
      {
        url: "https://revivefurniture.pk/images/chairs-stools.webp",
        width: 1200,
        height: 630,
        alt: "Chairs & Stools Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chairs & Stools in Pakistan | Dining, Office & Bar Chairs | Revive Furniture",
    description: "Premium chairs and stools in Pakistan. Dining chairs, office chairs, bar stools, and accent chairs.",
    images: ["https://revivefurniture.pk/images/chairs-stools.webp"],
  },
  alternates: {
    canonical: "https://revivefurniture.pk/chairs-stools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function ChairsStoolsPage() {
  return <ShopPageWrapper initialSearch="Chairs & Stools" />
}
